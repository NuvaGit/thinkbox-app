import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h3>ThinkBox</h3>
          <p>Unleash your team's creative potential</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="/features">Features</a></li>
              <li><a href="/templates">Templates</a></li>
              <li><a href="/pricing">Pricing</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/tutorials">Tutorials</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} ThinkBox. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;