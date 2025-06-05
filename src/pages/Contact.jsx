import React from 'react';
import './contact.css'; // Import the CSS file for this component

const ContactUs = () => {
  return (
    <div className="contact-us-page"> {/* Changed class to be more specific */}
      <h1 className="page-title">Get in Touch</h1> {/* Added a main page title */}
      <p className="page-intro">
        We're here to help! Whether you have questions about our courses, faculty, or admissions,
        feel free to reach out. We would love to hear from you.
      </p>

      <section className="contact-details-section"> {/* Specific section class */}
        <h2 className="section-heading">Our Contact Information</h2> {/* Specific heading class */}
        <div className="contact-items-grid"> {/* Grid for contact items */}
          <div className="contact-item">
            <span className="contact-icon">📍</span> {/* Span for better icon styling */}
            <h3 className="item-title">Address</h3>
            <p className="item-description"> Electron Academy, KPHB, Hyderabad, Telangana, India</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <h3 className="item-title">Phone</h3>
            <p className="item-description">+91 8341482438</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <h3 className="item-title">Email</h3>
            <p className="item-description">electronacademy.2019@gmail.com</p>
          </div>
        </div>
      </section>

      {/* Optional: Add a Contact Form section here if needed in the future */}
      {/*
      <section className="contact-form-section">
        <h2 className="section-heading">Send Us a Message</h2>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="6" required></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </section>
      */}

      <section className="map-section"> {/* Specific section class */}
        <h2 className="section-heading">Our Location</h2>
        <div className="map-container">
          <iframe
            title="Google Map"
            // IMPORTANT: Replace this with your actual Google Maps embed URL
            // Go to Google Maps, search for your location, click "Share", then "Embed a map"
  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15226.295827900145!2d78.394726!3d17.494843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1717473880000!5m2!1sen!2sin"
            width="100%"
            height="500" // Increased height for better visibility
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;