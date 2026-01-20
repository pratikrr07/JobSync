import { useState } from 'react';
import { generateCoverLetter } from '../services/api';

// AI-powered cover letter generator - users fill in job details and we generate the letter
function CoverLetterGenerator() {
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    job_description: '',
    user_name: '',
    user_skills: ''
  });
  
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.job_title || !formData.company_name || !formData.job_description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setCoverLetter('');
    setCopied(false);

    try {
      const response = await generateCoverLetter(formData);
      setCoverLetter(response.cover_letter);
    } catch (err) {
      setError(err.message || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFormData({
      job_title: '',
      company_name: '',
      job_description: '',
      user_name: '',
      user_skills: ''
    });
    setCoverLetter('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="cover-letter-generator">
      <div className="generator-header">
        <h2>🤖 AI Cover Letter Generator</h2>
        <p>Generate a personalized cover letter based on the job description</p>
      </div>

      <form onSubmit={handleSubmit} className="generator-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="job_title">Job Title *</label>
            <input
              type="text"
              id="job_title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_name">Company Name *</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g., Google"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="job_description">Job Description *</label>
          <textarea
            id="job_description"
            name="job_description"
            value={formData.job_description}
            onChange={handleChange}
            placeholder="Paste the job description here..."
            rows="6"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="user_name">Your Name (Optional)</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="user_skills">Your Key Skills (Optional)</label>
            <input
              type="text"
              id="user_skills"
              name="user_skills"
              value={formData.user_skills}
              onChange={handleChange}
              placeholder="e.g., React, Python, AWS..."
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '🔄 Generating...' : '✨ Generate Cover Letter'}
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            🔄 Reset
          </button>
        </div>
      </form>

      {coverLetter && (
        <div className="cover-letter-result">
          <div className="result-header">
            <h3>Generated Cover Letter</h3>
            <button 
              className="btn-copy" 
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div className="cover-letter-content">
            <pre>{coverLetter}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoverLetterGenerator;
