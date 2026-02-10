import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="google-footer">
      <div className="footer-top">
        <div className="footer-links">
          <a href="#">About Skora</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Help</a>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <div className="footer-bottom-right">
          <p>© 2026 Proto-Xue Team | Skora version 3.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;