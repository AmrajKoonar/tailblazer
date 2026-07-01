import { Link } from 'react-router-dom';
import { PawPrint, Heart } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <PawPrint size={20} aria-hidden="true" />
            <span>
              <span className="footer-logo-tail">Tail</span>Blazer
            </span>
          </Link>
          <p className="footer-tagline">
            Helping lost pets find their way home, one report at a time.
          </p>
          <div className="footer-tags">
            <span className="footer-tag">React</span>
            <span className="footer-tag">TypeScript</span>
            <span className="footer-tag">Leaflet</span>
            <span className="footer-tag">REST APIs</span>
          </div>
        </div>

        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/submit" className="footer-link">Submit a Report</Link>
          <a
            href="https://github.com/AmrajKoonar/tailblazer"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link footer-github-link"
          >
            <img src={`${import.meta.env.BASE_URL}github_icon.png`} alt="" className="footer-github-icon" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Amraj Koonar &middot; CMPT 272 Assignment 4:
          TailBlazer — Lost Animal Reporting System.
        </p>
        <p className="footer-made">
          Built with <Heart size={13} aria-hidden="true" className="footer-heart" /> for the community
        </p>
      </div>
    </footer>
  );
}

export default Footer;
