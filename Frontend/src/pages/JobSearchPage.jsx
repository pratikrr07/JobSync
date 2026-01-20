import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import JobSearch from '../components/JobSearch';

// Search for new jobs from Adzuna
function JobSearchPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="job-search-page">
      <Navbar />
      
      <main className="page-main">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon">🔍</span>
            Job Search
          </h1>
          <p className="page-description">
            Discover thousands of job opportunities from top companies worldwide. 
            Search by keywords and location, then import directly to your tracker.
          </p>
        </div>

        <div className="page-content">
          <JobSearch />
        </div>
      </main>
    </div>
  );
}

export default JobSearchPage;
