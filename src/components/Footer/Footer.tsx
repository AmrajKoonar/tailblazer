import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-tags">
        <span className="footer-tag">React</span>
        <span className="footer-tag">TypeScript</span>
        <span className="footer-tag">Leaflet</span>
        <span className="footer-tag">REST APIs</span>
      </div>
      <p>&copy; {new Date().getFullYear()} Amraj Koonar. CMPT 272 Assignment 4: TailBlazer - Lost Animal Reporting System.</p>
      <a
        href="https://github.com/AmrajKoonar/tailblazer"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-github-link"
      >
        <img src="/github_icon.png" alt="GitHub" className="footer-github-icon" />
        GitHub
      </a>
    </footer>
  );
}

export default Footer;
