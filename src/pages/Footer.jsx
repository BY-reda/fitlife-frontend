import React from 'react';
import '../css/Footer.css';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h3>FitLife</h3>
          <p>
            Transforming lives through fitness since 2010.
            <br />Join our community and start your fitness journey today in Agadir.
          </p>
          <div className="footer-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <Twitter className="icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="icon" />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/membership">Membership</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Services</h4>
          <ul>
            <li><a href="/personal-training">Personal Training</a></li>
            <li><a href="/group-classes">Group Classes</a></li>
            <li><a href="/nutrition-coaching">Nutrition Coaching</a></li>
            <li><a href="/online-programs">Online Programs</a></li>
            <li><a href="/corporate-wellness">Corporate Wellness</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact Us</h4>
          <p>123 Fitness Street<br />
            Agadir, Morocco</p>
          <p>Email: info@fitlife.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 FitLife. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
