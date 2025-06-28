import React from "react";
import "./Footer.css";
// Added FaYoutube to the import list
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-about">
          <h3>Personalized Learning for Success</h3>
          <p>
            We understand that every student has unique needs and abilities,
            that's why our curriculum is designed to adapt to your needs and
            help you grow! Our one-to-one online tuition is tailored
            specifically for **NEET and JEE** aspirants, ensuring focused
            attention and comprehensive preparation.
          </p>
        </div>
        <div className="footer-social">
          <h3>Connect With Us</h3>
  <div className="social-icons">
  <a
    href="https://www.youtube.com/@electronacademy.2024"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="YouTube"
  >
    <FaYoutube />
  </a>
  <a
    href="https://www.instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
  >
    <FaInstagram />
  </a>
  <a
    href="https://www.twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Twitter"
  >
    <FaTwitter />
  </a>
  <a
    href="https://www.facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
  >
    <FaFacebookF />
  </a>
  <a
    href="https://www.linkedin.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
  >
    <FaLinkedinIn />
  </a>
</div>

        </div>
        <div className="footer-address">
          <h3>Our Address</h3>
          <p>Electron Academy,</p>
          <p>KPHB,</p>
          <p>Hyderabad,</p>
          <p>India</p>
          <p>500072</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Electron Academy. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
