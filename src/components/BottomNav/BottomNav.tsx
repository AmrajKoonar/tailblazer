import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, PlusCircle } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import './BottomNav.css';

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const goBrowse = () => {
    const scrollToBrowse = () =>
      document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' });
    if (isHome) {
      scrollToBrowse();
    } else {
      navigate('/');
      // Allow the home page to render before scrolling to the browse section
      window.setTimeout(scrollToBrowse, 350);
    }
  };

  return (
    <motion.nav
      className="bottom-nav"
      aria-label="Mobile navigation"
      initial={{ y: 90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Link to="/" className={`bottom-nav__item ${isHome ? 'active' : ''}`}>
        <Home size={20} aria-hidden="true" />
        <span>Home</span>
      </Link>
      <button type="button" className="bottom-nav__item" onClick={goBrowse}>
        <Search size={20} aria-hidden="true" />
        <span>Browse</span>
      </button>
      <Link
        to="/submit"
        className={`bottom-nav__item ${location.pathname === '/submit' ? 'active' : ''}`}
      >
        <PlusCircle size={20} aria-hidden="true" />
        <span>Submit</span>
      </Link>
      <ThemeToggle showLabel className="bottom-nav__item bottom-nav__theme" />
    </motion.nav>
  );
}

export default BottomNav;
