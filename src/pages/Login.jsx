import React, { useState, useEffect } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';

// Adjust paths as needed
import Loader from './Loader'; // Assuming components folder
import Modal from './Modal';   // Assuming components folder

import { FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  // Derived modal content from Redux state for consistency
  // If `error` is null/empty, it will default to the second part of the OR (e.g., empty string, but for modal use, a fallback is good)
  const modalStatus = isAuthenticated ? 'success' : 'error'; // Modal status is 'error' if error exists or always 'error' on failure paths
const modalMessage = isAuthenticated
  ? 'Login successful! Redirecting...'
  : (error?.message || error || 'An unknown error occurred. Please try again.');
  // useEffect to redirect already authenticated users from the login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  console.log("Redux Error State:", error); // Add this for direct observation
  console.log("Is Modal Open?", isModalOpen); // Add this for direct observation

  // useEffect to show modal feedback after login attempt (success or failure)
  useEffect(() => {
    // Corrected: Check directly if 'error' (the string) exists
    if (error) { // This will be true if `state.auth.error` contains a string (e.g., "Invalid credentials.")
      setModalOpen(true);
      // No setTimeout here, so the error modal stays open until user closes it.
      // Or you can add a timer if you prefer it to auto-close.
      // Example: setTimeout(() => setModalOpen(false), 3000);
    } else if (isAuthenticated && !loading) { // For successful logins (and not loading anymore)
      setModalOpen(true);
      const timer = setTimeout(() => {
        setModalOpen(false);
      }, 1500); // Close success modal after 1.5 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }

    // Cleanup: Close modal if component unmounts or state changes
    // This return function will run when the component unmounts
    // or when any of the dependencies in the dependency array change on the *next* render.
    // Ensure this doesn't prematurely close modals you intend to keep open.
    // For error modals, you might want the user to click close.
    // If you add a timeout to the error modal, this cleanup is less critical for keeping it open.
    return () => {
      // setModalOpen(false); // Only do this if you want it to close on dependency changes too
    };
  }, [error, isAuthenticated, loading]); // Dependencies for this effect are correct

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
    // Very important: Clear Redux error when user starts typing on input fields after an error
    if (error) {
        dispatch({ type: 'SET_AUTH_ERROR', payload: null }); // Assuming SET_AUTH_ERROR clears the error
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

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
      return;
    }

    // Always clear previous Redux errors before a new login attempt
    if (error) {
        dispatch({ type: 'SET_AUTH_ERROR', payload: null }); // Assuming SET_AUTH_ERROR clears the error
    }

    dispatch(loginUser(formData));
  };

  return (
    <div className="signup-page-container">
      {/* {loading && <Loader />} */}
      <div className="signup-card">
        <h2 className="signup-title">Welcome Back!</h2>
        <p className="signup-subtitle">
          Log in to continue your learning journey and manage your account.
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
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
              // disabled={loading}
            />
            {errors.email && <span className="error-message-signup">{errors.email}</span>}
          </div>

          <div className="form-group-signup password-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-button left"
                // disabled={loading}
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
                // disabled={loading}
              />
            </div>
            {errors.password && <span className="error-message-signup">{errors.password}</span>}
          </div>

          <button type="submit" className="signup-button"
          //  disabled={loading}
           >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="login-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p className="login-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={modalStatus === 'success' ? 'Success!' : 'Login Failed!'}
        message={modalMessage}
        status={modalStatus}
        icon={modalStatus === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
      />
    </div>
  );
};

export default LoginPage;