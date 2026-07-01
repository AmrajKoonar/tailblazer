import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, PlusCircle } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <motion.header
      className="header"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="header-content">
        <Link to="/" className="header-logo">
          <img src={`${import.meta.env.BASE_URL}paw.png`} alt="TailBlazer logo" className="logo-icon" />
          <span className="logo-text">
            <span className="logo-tail">Tail</span>Blazer
          </span>
        </Link>
        <nav className="header-nav" aria-label="Primary">
          <div className="header-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={17} aria-hidden="true" />
              Home
            </Link>
            <Link
              to="/submit"
              className={`nav-link nav-cta ${location.pathname === '/submit' ? 'active' : ''}`}
            >
              <PlusCircle size={17} aria-hidden="true" />
              Submit Report
            </Link>
          </div>
          <ThemeToggle className="header-theme" />
        </nav>
      </div>
    </motion.header>
  );
}

export default Header;
