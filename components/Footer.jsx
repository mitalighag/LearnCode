import React from "react";
import "../styles/Footer.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>LearnCode</h3>
          <p>Empowering the next generation of developers with quality education.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Features</a></li>
            <li><a href="/browse-courses">Courses</a></li>
            <li><a href="/Testimonials">Testimonials</a></li>
            <li><a href="#">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Join Us</h3>
          <ul>
            <li><a href="/landing">Start Learning</a></li>
            <li><a href="/instructor-landing">Become an Instructor</a></li>
          </ul>
        </div>
      </div>

      
      <div className="social-icons">
        <FaFacebook />
        <FaTwitter />
        <FaLinkedin />
        <FaInstagram />
      </div>

     
      <hr className="footer-line" />

      
      <p className="footer-copy">© 2025 LearnCode.All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
