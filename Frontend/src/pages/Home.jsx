import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import JobStats from '../components/JobStats';

// Landing page that shows what JobSync can do
// Displays feature cards, stats, and a quick start guide
function Home() {
  const navigate = useNavigate();

  const features = [
    {
      id: 'search',
      icon: '🔍',
      title: 'Job Search',
      description: 'Discover thousands of job opportunities from top companies worldwide. Search by keywords, location, and filter results to find your perfect match.',
      highlights: [
        'Real-time job listings from Adzuna API',
        'Search across multiple countries',
        'Instant import to your tracker',
        'Salary insights and details'
      ],
      color: '#06b6d4',
      path: '/search'
    },
    {
      id: 'tracker',
      icon: '📋',
      title: 'Application Tracker',
      description: 'Organize and manage all your job applications in one place. Track status, add notes, and monitor your progress through the hiring pipeline.',
      highlights: [
        'Track application status and progress',
        'Visual statistics dashboard',
        'Add notes and important details',
        'Filter by application stage'
      ],
      color: '#0ea5e9',
      path: '/tracker'
    },
    {
      id: 'ai',
      icon: '🤖',
      title: 'AI Cover Letter Generator',
      description: 'Create personalized, professional cover letters in seconds using AI. Powered by local Ollama model for privacy and unlimited usage.',
      highlights: [
        'AI-powered personalization',
        'Free and unlimited generation',
        'Tailored to job descriptions',
        'Copy and edit instantly'
      ],
      color: '#8b5cf6',
      path: '/cover-letter'
    }
  ];

  return (
    <div className="home-page">
      <Navbar />
      
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">JobSync</span>
            </h1>
            <p className="hero-subtitle">
              Your All-in-One Job Application Platform
            </p>
            <p className="hero-description">
              Search thousands of jobs, track your applications, and generate AI-powered cover letters — all in one place.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <JobStats />
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="features-heading">Powerful Features</h2>
          
          <div className="features-grid">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className="feature-card"
                onClick={() => navigate(feature.path)}
                style={{ '--feature-color': feature.color }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                
                <ul className="feature-highlights">
                  {feature.highlights.map((highlight, index) => (
                    <li key={index}>
                      <span className="highlight-bullet">✓</span>
                      {highlight}
                    </li>
                  ))}
                </ul>

                <button className="feature-btn">
                  Get Started →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="quick-start-section">
          <h2 className="quick-start-heading">Get Started in 3 Steps</h2>
          <div className="quick-start-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Search Jobs</h4>
              <p>Browse thousands of opportunities</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Generate Cover Letter</h4>
              <p>Create personalized applications</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Track Applications</h4>
              <p>Monitor your progress</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
