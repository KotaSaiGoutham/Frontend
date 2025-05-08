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

      <section className="map">
  <h2>Our Location</h2>
  <iframe
    title="Google Map"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.170119867272!2d78.38501947518106!3d17.447110501098667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93c5e5f48c4f%3A0x375e2f16ae0ee74e!2sMindspace%20IT%20Park%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1715190000000!5m2!1sen!2sin"
    width="100%"
    height="450"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</section>

    </div>
  );
}

export default ContactUs;
