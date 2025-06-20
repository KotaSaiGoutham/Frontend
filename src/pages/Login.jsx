import React, { useState } from 'react';
import './Signup.css'; // We'll reuse the existing CSS for consistent styling
import { Link, useNavigate } from 'react-router-dom';

// Assuming you have Loader and Modal components.
import Loader from './Loader'; // Adjust path as needed for your Loader component
import Modal from './Modal';   // Adjust path as needed for your Modal component

// Import eye icons for password toggle
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('success'); // 'success' or 'error'
  const navigate = useNavigate();

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for the specific field as user types
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  // Toggle function for password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setIsLoading(true);
    setModalMessage(''); // Clear previous modal messages
    setModalStatus('');

    try {
      // --- IMPORTANT: Corrected backend login endpoint ---
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json(); // Assuming your backend sends JSON response
      console.log("data",data)

      if (response.ok) {
        setModalMessage('Login successful! Redirecting...');
        setModalStatus('success');
        setModalOpen(true);

        // Store the JWT token from the backend
        if (data.token) {
          localStorage.setItem('token', data.token);
          // You might also store user ID or email if needed
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('userEmail', data.email);
          
        }

        // Redirect to a dashboard or home page after a short delay
        setTimeout(() => {
          navigate('/dashboard'); // Use navigate for SPA routing
          setModalOpen(false); // Close modal before redirect if it's still open
        }, 1500); // Redirect after 1.5 seconds

      } else {
        // Handle backend-specific errors (e.g., invalid credentials)
        const errorMessage = data.message || 'Login failed. Please check your credentials.';
        setModalMessage(errorMessage);
        setModalStatus('error');
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Network or server error during login:', error);
      setModalMessage('Network error. Please check your internet connection and try again.');
      setModalStatus('error');
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page-container"> {/* Reusing signup container styles */}
      {isLoading && <Loader />} {/* Loader overlay */}
      <div className="signup-card"> {/* Reusing signup card styles */}
        <h2 className="signup-title">Welcome Back!</h2>
        <p className="signup-subtitle">
          Log in to continue your learning journey and manage your account.
        </p>

        <form onSubmit={handleSubmit} className="signup-form"> {/* Reusing form styles */}
          <div className="form-group-signup">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email id"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message-signup">{errors.email}</span>}
          </div>

          {/* Password field with toggle button (using React Icons) */}
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
         

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="login-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
        <p className="login-link">
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={modalStatus === 'success' ? 'Success!' : 'Login Failed!'}
        message={modalMessage}
        status={modalStatus}
      />
    </div>
  );
};

export default LoginPage;