from fastapi import APIRouter, Depends, HTTPException, status
from app.database import job_collection
from app.schemas.job import JobCreate
from app.routes.deps import get_current_user
from datetime import datetime
from bson.objectid import ObjectId
import os
import requests
from dotenv import load_dotenv

# Create, read, update, delete job applications
# Also handles searching external jobs via Adzuna API

# Load environment variables
load_dotenv()

router = APIRouter()

@router.post("/", status_code=201)
def create_job(
    job: JobCreate,
    user_token: str = Depends(get_current_user)
):
    new_job = {
        "company": job.company,
        "role": job.role,
        "status": job.status,
        "notes": job.notes or "",
        "user_token": user_token,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = job_collection.insert_one(new_job)
    return {
        "id": str(result.inserted_id),
        "message": "Job created successfully"
    }

@router.get("/")
def get_jobs(user_token: str = Depends(get_current_user)):
    jobs = []
    for job in job_collection.find({"user_token": user_token}).sort("created_at", -1):
        job["_id"] = str(job["_id"])
        jobs.append(job)
    return jobs

@router.get("/stats")
def get_stats(user_token: str = Depends(get_current_user)):
    jobs = list(job_collection.find({"user_token": user_token}))
    
    total = len(jobs)
    by_status = {}
    for job in jobs:
        status = job.get("status", "Unknown")
        by_status[status] = by_status.get(status, 0) + 1
    
    return {
        "total": total,
        "by_status": by_status,
        "applied": by_status.get("Applied", 0),
        "interviews": by_status.get("Interview", 0),
        "offers": by_status.get("Offer", 0),
        "rejected": by_status.get("Rejected", 0),
        "accepted": by_status.get("Accepted", 0)
    }

@router.put("/{job_id}")
def update_job(
    job_id: str,
    job: JobCreate,
    user_token: str = Depends(get_current_user)
):
    try:
        object_id = ObjectId(job_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid job ID")
    
    existing_job = job_collection.find_one({"_id": object_id, "user_token": user_token})
    if not existing_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    updated_job = {
        "company": job.company,
        "role": job.role,
        "status": job.status,
        "notes": job.notes or "",
        "updated_at": datetime.utcnow()
    }
    
    job_collection.update_one(
        {"_id": object_id},
        {"$set": updated_job}
    )
    
    return {
        "id": str(object_id),
        "message": "Job updated successfully"
    }

@router.delete("/{job_id}")
def delete_job(
    job_id: str,
    user_token: str = Depends(get_current_user)
):
    try:
        object_id = ObjectId(job_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid job ID")
    
    result = job_collection.delete_one({"_id": object_id, "user_token": user_token})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"message": "Job deleted successfully"}

@router.get("/search-external")
def search_external_jobs(
    keywords: str = "software engineer",
    location: str = "us",
    page: int = 1,
    results_per_page: int = 10
):
    """
    Search for jobs using Adzuna API.
    
    Args:
        keywords: Job title or keywords to search
        location: Country code (us, uk, ca, au, etc.)
        page: Page number for pagination
        results_per_page: Number of results per page (max 50)
        
    Returns:
        List of job postings from Adzuna aggregator
    """
    try:
        app_id = os.getenv("ADZUNA_APP_ID", "5f7cebac")
        app_key = os.getenv("ADZUNA_APP_KEY", "e072534a9188712ecb08ecff701e60b6")
        
        # Build Adzuna API URL
        url = f"https://api.adzuna.com/v1/api/jobs/{location}/search/{page}"
        
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "results_per_page": min(results_per_page, 50),
            "what": keywords,
            "content-type": "application/json"
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Format response
        jobs = []
        for result in data.get("results", []):
            company_name = "Unknown"
            if isinstance(result.get("company"), dict):
                company_name = result["company"].get("display_name", "Unknown")
            elif isinstance(result.get("company"), str):
                company_name = result["company"]
                
            location_name = ""
            if isinstance(result.get("location"), dict):
                location_name = result["location"].get("display_name", "")
            elif isinstance(result.get("location"), str):
                location_name = result["location"]
                
            description = result.get("description", "")
            if len(description) > 500:
                description = description[:500] + "..."
                
            jobs.append({
                "id": result.get("id"),
                "title": result.get("title"),
                "company": company_name,
                "location": location_name,
                "description": description,
                "salary_min": result.get("salary_min"),
                "salary_max": result.get("salary_max"),
                "contract_type": result.get("contract_type"),
                "created": result.get("created"),
                "job_url": result.get("redirect_url"),
            })
        
        return {
            "total": data.get("count", 0),
            "page": page,
            "results_per_page": results_per_page,
            "jobs": jobs
        }
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Adzuna API: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch jobs from Adzuna: {str(e)}"
        )
    except Exception as e:
        print(f"Error in search_external_jobs: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to search jobs: {str(e)}"
        )
