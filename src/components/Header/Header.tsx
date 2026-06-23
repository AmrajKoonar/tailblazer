import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <img src="/paw.png" alt="TailBlazer logo" className="logo-icon" />
          <span className="logo-text"><span className="logo-tail">Tail</span>Blazer</span>
        </Link>
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/submit"
            className={`nav-link ${location.pathname === '/submit' ? 'active' : ''}`}
          >
            Submit Report
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
