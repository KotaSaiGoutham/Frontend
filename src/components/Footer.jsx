import React from 'react';
import './Footer.css';
// Added FaYoutube to the import list
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-about">
          <h3>Personalized Learning for Success</h3>
          <p>
            We understand that every student has unique needs and abilities, that's why our curriculum is designed to adapt to your needs and help you grow! Our one-to-one online tuition is tailored specifically for **NEET and JEE** aspirants, ensuring focused attention and comprehensive preparation.
          </p>
        </div>
        <div className="footer-social">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://www.youtube.com/@electronacademy.2024" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube className="icon youtube" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="icon instagram" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="icon twitter" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF className="icon facebook" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn className="icon linkedin" />
            </a>

          </div>
        </div>
        <div className="footer-address">
          <h3>Our Address</h3>
          <p>Electron Academy</p>
          <p>123 Tuition Lane</p>
          <p>Knowledge City, KC 45678</p>
          <p>India</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Electron Academy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;