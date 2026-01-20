import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import JobForm from '../components/JobForm';
import JobCard from '../components/JobCard';
import JobStats from '../components/JobStats';
import { getJobs } from '../services/api';

// Main page where users manage all their job applications
function JobTrackerPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const data = await getJobs(token);
      setJobs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreated = () => {
    fetchJobs();
    setShowForm(false);
  };

  const filteredJobs = filter === 'All' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const statuses = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

  return (
    <div className="job-tracker-page">
      <Navbar />
      
      <main className="page-main">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon">📋</span>
            Application Tracker
          </h1>
          <p className="page-description">
            Organize and manage all your job applications in one place. 
            Track status, add notes, and monitor your progress.
          </p>
        </div>

        {/* Stats Section */}
        <section className="section">
          <JobStats />
        </section>

        {/* Add Application Button */}
        <section className="card" style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
            style={{ width: '100%', marginBottom: showForm ? '1.5rem' : 0 }}
          >
            {showForm ? '❌ Cancel' : '➕ Add New Application'}
          </button>
          {showForm && (
            <>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-white)' }}>
                Add New Application
              </h3>
              <JobForm onJobCreated={handleJobCreated} />
            </>
          )}
        </section>

        {/* Applications List */}
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Your Applications
            </h2>
            <span className="count-badge">{filteredJobs.length}</span>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="loading">Loading applications...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              <p>No applications yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map(job => (
                <JobCard 
                  key={job._id} 
                  job={job} 
                  onJobUpdated={fetchJobs} 
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default JobTrackerPage;
