from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

# Cover letter generation via local Ollama - no API keys needed, completely private

# Load environment variables from the Backend directory's .env file
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(os.path.join(backend_dir, '.env'))

router = APIRouter()

def get_ollama_config():
    """Return Ollama server URL and model name from env or defaults."""
    url = os.getenv("OLLAMA_URL", "http://localhost:11434")
    model = os.getenv("OLLAMA_MODEL", "llama3.2")
    return url, model

class CoverLetterRequest(BaseModel):
    job_title: str
    company_name: str
    job_description: str
    user_name: str = "Applicant"
    user_skills: str = ""

class CoverLetterResponse(BaseModel):
    cover_letter: str

@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(request: CoverLetterRequest):
    """
    Generate a personalized cover letter using a local Ollama model.

    Requires Ollama running locally and the selected model pulled.
    """
    try:
        ollama_url, model = get_ollama_config()

        # Construct the prompt for AI
        prompt = f"""
Write a professional and personalized cover letter for the following job application:

Job Title: {request.job_title}
Company Name: {request.company_name}
Applicant Name: {request.user_name}

Job Description:
{request.job_description}

{f"Applicant's Key Skills/Experience: {request.user_skills}" if request.user_skills else ""}

Please write a compelling cover letter that:
1. Addresses the specific requirements mentioned in the job description
2. Highlights relevant skills and experience
3. Shows enthusiasm for the role and company
4. Is professional, concise, and well-structured
5. Is between 250-350 words

Format the letter properly with appropriate paragraphs.
"""

        # Call Ollama HTTP API
        resp = requests.post(
            f"{ollama_url}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "temperature": 0.7
            },
            timeout=60
        )

        if resp.status_code >= 400:
            raise HTTPException(status_code=500, detail=f"Ollama error: {resp.text}")

        data = resp.json()
        cover_letter = (data.get("response") or "").strip()
        if not cover_letter:
            raise HTTPException(status_code=500, detail="Empty response from Ollama")

        return CoverLetterResponse(cover_letter=cover_letter)

    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=500,
            detail=(
                "Cannot connect to Ollama at http://localhost:11434. "
                "Make sure Ollama is installed and running: brew install --cask ollama; open -a Ollama; ollama pull llama3.2"
            )
        )
    except Exception as e:
        print(f"Error generating cover letter: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate cover letter: {str(e)}")
