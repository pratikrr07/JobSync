import { useState } from 'react';
import { searchExternalJobs, createJob } from '../services/api';

// Search for jobs from Adzuna and import them to your tracker
function JobSearch() {
  const [searchParams, setSearchParams] = useState({
    keywords: '',
    location: 'us',
    page: 1
  });
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalJobs, setTotalJobs] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchParams.keywords.trim()) {
      setError('Please enter job keywords');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await searchExternalJobs(
        searchParams.keywords,
        searchParams.location,
        searchParams.page
      );
      setJobs(data.jobs || []);
      setTotalJobs(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to search jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImportJob = async (job) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to import jobs');
        return;
      }

      await createJob({
        company: job.company,
        role: job.title,
        status: 'Applied',
        notes: `Imported from job search\n\nLocation: ${job.location}\n\nDescription: ${job.description}\n\nURL: ${job.job_url}`
      }, token);

      alert(`Successfully imported: ${job.title} at ${job.company}`);
    } catch (err) {
      setError(err.message || 'Failed to import job');
    }
  };

  const handleNextPage = () => {
    setSearchParams(prev => ({ ...prev, page: prev.page + 1 }));
    setTimeout(() => {
      document.querySelector('.job-search-form').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePrevPage = () => {
    if (searchParams.page > 1) {
      setSearchParams(prev => ({ ...prev, page: prev.page - 1 }));
      setTimeout(() => {
        document.querySelector('.job-search-form').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="job-search">
      <div className="search-header">
        <h2>🔍 Search Job Postings</h2>
        <p>Find opportunities from thousands of job boards</p>
      </div>

      <form onSubmit={handleSearch} className="job-search-form">
        <div className="search-inputs">
          <div className="form-group">
            <input
              type="text"
              name="keywords"
              value={searchParams.keywords}
              onChange={handleInputChange}
              placeholder="e.g., software engineer, frontend developer"
              required
            />
          </div>

          <div className="form-group">
            <select
              name="location"
              value={searchParams.location}
              onChange={handleInputChange}
            >
              <option value="us">United States</option>
              <option value="gb">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
              <option value="in">India</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '🔄 Searching...' : '🔍 Search Jobs'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {totalJobs > 0 && (
        <div className="search-meta">
          <p>Found {totalJobs.toLocaleString()} jobs • Page {searchParams.page}</p>
        </div>
      )}

      {jobs.length > 0 && (
        <>
          <div className="job-results">
            {jobs.map((job) => (
              <div key={job.id} className="job-result-card">
                <div className="job-result-header">
                  <h3>{job.title}</h3>
                  <button
                    onClick={() => handleImportJob(job)}
                    className="btn-import"
                    title="Add to your tracker"
                  >
                    + Import
                  </button>
                </div>
                
                <div className="job-result-meta">
                  <span className="company">🏢 {job.company}</span>
                  {job.location && <span className="location">📍 {job.location}</span>}
                  {job.contract_type && <span className="contract">{job.contract_type}</span>}
                </div>

                {(job.salary_min || job.salary_max) && (
                  <div className="job-salary">
                    💰 {job.salary_min && `$${job.salary_min.toLocaleString()}`}
                    {job.salary_min && job.salary_max && ' - '}
                    {job.salary_max && `$${job.salary_max.toLocaleString()}`}
                  </div>
                )}

                {job.description && (
                  <div className="job-description">
                    <p dangerouslySetInnerHTML={{ __html: job.description }}></p>
                  </div>
                )}

                {job.job_url && (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="job-link"
                  >
                    View Full Posting →
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={searchParams.page === 1}
              className="btn-secondary"
            >
              ← Previous
            </button>
            <span className="page-indicator">Page {searchParams.page}</span>
            <button
              onClick={handleNextPage}
              className="btn-secondary"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {!loading && jobs.length === 0 && searchParams.keywords && (
        <div className="empty-state">
          <p>No jobs found. Try different keywords or location.</p>
        </div>
      )}
    </div>
  );
}

export default JobSearch;
