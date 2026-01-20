import { Link, useLocation, useNavigate } from 'react-router-dom';

// The top navigation bar - lets users jump between home, search, tracker, and cover letter pages
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-brand">
          <span className="brand-icon">🚀</span>
          <span className="brand-name">JobSync</span>
        </Link>

        <div className="navbar-links">
          <Link 
            to="/home" 
            className={`nav-link ${isActive('/home') ? 'active' : ''}`}
          >
            🏠 Home
          </Link>
          <Link 
            to="/search" 
            className={`nav-link ${isActive('/search') ? 'active' : ''}`}
          >
            🔍 Job Search
          </Link>
          <Link 
            to="/tracker" 
            className={`nav-link ${isActive('/tracker') ? 'active' : ''}`}
          >
            📋 Tracker
          </Link>
          <Link 
            to="/cover-letter" 
            className={`nav-link ${isActive('/cover-letter') ? 'active' : ''}`}
          >
            🤖 AI Cover Letter
          </Link>
        </div>

        <button onClick={handleLogout} className="logout-btn-nav">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
