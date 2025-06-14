import React, { useState } from "react";
import "./BookDemo.css"; // Ensure this CSS file is linked
import emailjs from "@emailjs/browser";
import Modal from "./Modal"; // adjust path if needed
import Loader from "./Loader"; // adjust path if needed

const BookDemo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    stream: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }
    if (!formData.stream) {
      newErrors.stream = "Please select a stream";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error for the field being changed
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    emailjs
      .send(
        "service_96hpvsw",
        "template_fj32b8k",
        {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          subject: formData.subject,
          stream: formData.stream,
          message: formData.message,
        },
        "CodaKdlgBTQoYetms"
      )
      .then(() => {
        setIsLoading(false);
        setModalOpen(true);
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          stream: "",
          message: "",
        }); // Clear form
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("EmailJS error:", error); // Log the actual error
        setModalOpen(true);
        setSubmitted(false);
      });
  };

  return (
    <div className="book-demo-page">
      {isLoading && <Loader />} {/* Loader overlay */}
      <div className="book-demo-card">
        <h2 className="card-title">Book a Free Demo Class</h2>
        <p className="card-description">
          Fill in your details and we’ll schedule your one-on-one demo class
          with our expert tutors.
        </p>
        <form onSubmit={handleSubmit} className="demo-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-group">
            <input
              type="tel" // Changed to "tel" for better mobile keyboard support
              name="mobile"
              placeholder="Your Mobile Number (10 digits)"
              value={formData.mobile}
              onChange={handleChange}
              required
              className={errors.mobile ? "input-error" : ""}
              pattern="[0-9]{10}" // HTML5 pattern for client-side validation hint
              title="Mobile number must be exactly 10 digits"
            />
            {errors.mobile && <p className="error-message">{errors.mobile}</p>}
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          {/* Custom styled select for Stream */}
          <div className="form-group">
            <div className="custom-select-wrapper">
              <select
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                required
                className={errors.stream ? "input-error" : ""}
              >
                <option value="" disabled>Select Stream</option>
                <option value="NEET">NEET</option>
                <option value="JEE Mains">JEE Mains</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="BITSAT">BITSAT</option>
                <option value="EAPCET">EAPCET</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="IGCSE (Cambridge)">IGCSE (Cambridge)</option>
                <option value="IB">IB</option>
                <option value="Foundation">Foundation</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {errors.stream && <p className="error-message">{errors.stream}</p>}
          </div>
          {/* Custom styled select for Subject */}
          <div className="form-group">
            <div className="custom-select-wrapper">
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={errors.subject ? "input-error" : ""}
              >              
                <option value=""  disabled>Select Subject for Demo</option>
                <option value="Maths">Maths</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {errors.subject && (
              <p className="error-message">{errors.subject}</p>
            )}
          </div>

          <button type="submit" className="submit-button">
            Book Your Free Demo
          </button>
        </form>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={submitted ? "Demo Booked!" : "Submission Failed"}
        message={
          submitted
            ? "Thank you for booking a demo class. We will get in touch with you shortly."
            : "Something went wrong. Please try again."
        }
        status={submitted ? "success" : "error"}
      />
    </div>
  );
};

export default BookDemo;