import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CoverLetterGenerator from '../components/CoverLetterGenerator';

// Generate cover letters with AI - runs locally on your machine
function CoverLetterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="cover-letter-page">
      <Navbar />
      
      <main className="page-main">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon">🤖</span>
            AI Cover Letter Generator
          </h1>
          <p className="page-description">
            Create personalized, professional cover letters in seconds using AI. 
            Powered by local Ollama model for complete privacy and unlimited usage.
          </p>
        </div>

        <div className="page-content">
          <div className="info-cards">
            <div className="info-card">
              <span className="info-icon">✨</span>
              <div>
                <h4>AI-Powered</h4>
                <p>Uses advanced language models to create compelling letters</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">🔒</span>
              <div>
                <h4>Private & Secure</h4>
                <p>Runs locally on your machine - your data never leaves</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">♾️</span>
              <div>
                <h4>Unlimited</h4>
                <p>Generate as many cover letters as you need, completely free</p>
              </div>
            </div>
          </div>

          <CoverLetterGenerator />
        </div>
      </main>
    </div>
  );
}

export default CoverLetterPage;
