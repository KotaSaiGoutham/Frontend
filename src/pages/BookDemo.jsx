import React, { useState } from 'react';
import './BookDemo.css';
import emailjs from '@emailjs/browser';
import Modal from './Modal'; // adjust path if needed

const BookDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });
  const [isModalOpen, setModalOpen] = useState(false);


  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    emailjs.send('service_96hpvsw', 'template_fj32b8k', {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      subject: formData.subject,
      message: formData.message
    }, 'CodaKdlgBTQoYetms')
      .then(() => {
        setModalOpen(true);
        setSubmitted(true);
        setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
      })
      .catch(() => {
        alert('Something went wrong. Please try again.');
      });
  };

  return (
    <div className="book-demo-container">
      <h2>Book a Free Demo Class</h2>
      <p>Fill in your details and we’ll schedule your one-on-one demo class with our expert tutors.</p>
      <form onSubmit={handleSubmit} className="demo-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="number"
          name="mobile"
          placeholder="Your Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        {errors.mobile && <p className="error">{errors.mobile}</p>}

        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        >
          <option value="">Select Subject</option>
          <option value="Maths">Maths</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Physics">Physics</option>
        </select>

        <textarea
          name="message"
          placeholder="Additional Message (Optional)"
          rows="4"
          value={formData.message}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Book Demo</button>
      </form>
      <Modal
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  title="Demo Booked!"
  message="Thank you for booking a demo class. We will get in touch with you shortly."
/>
    </div>
  );
};

export default BookDemo;
