import React from 'react';
import './contact.css';  // Import the CSS file for this component

const ContactUs = () => {
  return (
    <div className="contact-us">
      <section className="contact-info">
        <h2>Contact Us</h2>
        <p>If you have any questions, feel free to reach out to us. We would love to hear from you!</p>
        
        <div className="contact-details">
          <div className="contact-item">
            <h3>📍 Address</h3>
            <p>123 Electron Academy, Tech Park, Hyderabad, Telangana, India</p>
          </div>
          <div className="contact-item">
            <h3>📞 Phone</h3>
            <p>+91 123 456 7890</p>
          </div>
          <div className="contact-item">
            <h3>✉️ Email</h3>
            <p>contact@electronacademy.com</p>
          </div>
        </div>
      </section>

      <section className="contact-form">
        <h2>Get in Touch</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>

          <button type="submit">Submit</button>
        </form>
      </section>

      <section className="map">
        <h2>Our Location</h2>
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed/v1/place?q=Tech%20Park%2C%20Hyderabad%2C%20Telangana%2C%20India&key=YOUR_GOOGLE_MAPS_API_KEY"
          width="600"
          height="450"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
}

export default ContactUs;
