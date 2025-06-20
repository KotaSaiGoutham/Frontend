import React, { useState } from 'react';
import './Signup.css'; // Your CSS file will be updated below

import Loader from './Loader'; // Adjust path as needed
import Modal from './Modal';   // Adjust path as needed

// Import eye icons from react-icons/fa (Font Awesome)
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('success');

  // New state variables for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  // Toggle functions for password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
      isValid = false;
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      let passwordErrors = [];
      if (formData.password.length < 8) {
        passwordErrors.push('At least 8 characters long');
      }
      if (!/[A-Z]/.test(formData.password)) {
        passwordErrors.push('At least one capital letter');
      }
      if (!/[a-z]/.test(formData.password)) {
        passwordErrors.push('At least one small letter');
      }
      if (!/[0-9]/.test(formData.password)) {
        passwordErrors.push('At least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        passwordErrors.push('At least one special character');
      }

      if (passwordErrors.length > 0) {
        newErrors.password = 'Password must contain: ' + passwordErrors.join(', ');
        isValid = false;
      }
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) {
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {  // 👈 Explicit localhost URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setModalMessage('Signup successful! You can now log in.');
      setModalStatus('success');
      setModalOpen(true);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      const errorMessage = data.message || 'Signup failed. Please try again.';
      setModalMessage(errorMessage);
      setModalStatus('error');
      setModalOpen(true);
    }
  } catch (error) {
    console.error('Network or server error during signup:', error);
    setModalMessage('Network error. Please check your internet connection and try again.');
    setModalStatus('error');
    setModalOpen(true);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="signup-page-container">
      {isLoading && <Loader />}
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">
          Join us to unlock personalized learning and manage your portfolio!
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group-signup">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.name && <span className="error-message-signup">{errors.name}</span>}
          </div>

          <div className="form-group-signup">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g., yourname@example.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message-signup">{errors.email}</span>}
          </div>

          <div className="form-group-signup">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="e.g., 9876543210"
              value={formData.mobile}
              onChange={handleChange}
              className={errors.mobile ? 'input-error' : ''}
              disabled={isLoading}
              maxLength="10"
            />
            {errors.mobile && <span className="error-message-signup">{errors.mobile}</span>}
          </div>

      <div className="form-group-signup password-group">
  <label htmlFor="password">Password</label>
  <div className="input-icon-wrapper">
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="password-toggle-button left"
      disabled={isLoading}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
    <input
      type={showPassword ? 'text' : 'password'}
      id="password"
      name="password"
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
      className={`input-with-icon ${errors.password ? 'input-error' : ''}`}
      disabled={isLoading}
    />
  </div>
  {errors.password && <span className="error-message-signup">{errors.password}</span>}
</div>


        <div className="form-group-signup password-group">
  <label htmlFor="confirmPassword">Confirm Password</label>
  <div className="input-icon-wrapper">
    <button
      type="button"
      onClick={toggleConfirmPasswordVisibility}
      className="password-toggle-button left"
      disabled={isLoading}
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
    <input
      type={showConfirmPassword ? 'text' : 'password'}
      id="confirmPassword"
      name="confirmPassword"
      placeholder="Re-enter your password"
      value={formData.confirmPassword}
      onChange={handleChange}
      className={`input-with-icon ${errors.confirmPassword ? 'input-error' : ''}`}
      disabled={isLoading}
    />
  </div>
  {errors.confirmPassword && (
    <span className="error-message-signup">{errors.confirmPassword}</span>
  )}
</div>


          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={modalStatus === 'success' ? 'Success!' : 'Oops!'}
        message={modalMessage}
        status={modalStatus}
      />
    </div>
  );
};

export default SignupPage;