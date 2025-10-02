import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Guerilla Teaching</h3>
            <p>Empowering education through innovative teaching methods.</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@guerillateaching.africa</p>
            <p>Phone: +27 123 456 789</p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Guerilla Teaching. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 