import React, { useState, useEffect } from 'react';
import './Signup.css'; // Your CSS file

import Loader from './Loader'; // Adjust path as needed for your Loader component
import Modal from './Modal';   // Adjust path as needed for your Modal component

// Import eye icons and check/exclamation icons from react-icons/fa
import { FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

// Import Redux hooks and your signup action
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, setAuthError } from '../redux/actions'; // setAuthError is good for clearing errors

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get loading and error states directly from Redux's auth slice
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  // Use a local state to track signup success, as `isAuthenticated` is not set on signup.
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Derived modal content based on local success flag and Redux error
  const modalMessage = signupSuccess
    ? 'Signup successful! You can now log in.'
    : (error || 'Signup failed. Please try again.'); // If Redux error is null, provide a generic fallback
  const modalStatus = signupSuccess ? 'success' : 'error'; // Modal status is 'error' if error exists or always 'error' on failure paths


  // EFFECT 1: Handles displaying the modal based on Redux error or local signup success
  useEffect(() => {
    if (error) { // If an error exists in Redux state (e.g., from SIGNUP_FAILURE)
      setModalOpen(true);
      setSignupSuccess(false); // Ensure success flag is false if an error occurs
    } else if (signupSuccess) { // If signup was successful (local state)
      setModalOpen(true);
      // Optional: Redirect to login page after a short delay on successful signup
      const timer = setTimeout(() => {
        setModalOpen(false); // Close modal
        navigate('/login'); // Redirect to login page
      }, 2000); // 2-second delay
      return () => clearTimeout(timer); // Cleanup timer on unmount or dependency change
    }
  }, [error, signupSuccess, navigate]); // Dependencies: react to changes in error, signupSuccess, navigate

  // EFFECT 2: Clears Redux error when user interacts with form (typing) or modal closes
  useEffect(() => {
    // This effect runs if isModalOpen changes, or if error changes.
    // If the modal just closed (isModalOpen is false) AND there was an error, clear the Redux error.
    // This ensures error messages are cleared when the user closes the modal.
    if (!isModalOpen && error) {
      dispatch(setAuthError(null));
    }
    // Also clear Redux error when user starts typing on any input field
    // (This is handled in handleChange now, but this useEffect could also trigger it)
  }, [isModalOpen, error, dispatch]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear field-specific validation errors as user types
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
    // Clear Redux error when user starts typing after a previous error
    if (error) {
      dispatch(setAuthError(null)); // Assuming SET_AUTH_ERROR clears the error (payload: null)
    }
    // Reset signup success state on any form change
    if (signupSuccess) {
      setSignupSuccess(false);
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
      // You could add a specific message for non-numeric input if needed
    }

    // Password Validation (more robust)
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
      // Added a comma here for consistency if more validation messages are added.
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

    // Clear any previous Redux error or local success state before new attempt
    setSignupSuccess(false);
    if (error) {
      dispatch(setAuthError(null));
    }

    if (!validateForm()) {
      return; // Stop if client-side validation fails
    }

    try {
      // Dispatch the signupUser action.
      // The `apiMiddleware` returns a promise from `action.meta.deferred.promise`.
      // We await it here to know if the API call itself resolved or rejected.
      // The actual success/failure state (and error message) is managed in Redux.
      await dispatch(signupUser({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      })).promise; // Access the promise from the apiRequest meta

      // If the above promise resolves (meaning onSuccess was called in the action),
      // it signifies a successful signup at the API level.
      setSignupSuccess(true); // Set local success flag
      // Form clearing is done here on successful signup
      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      // This catch block will only catch errors if the *dispatching* of the action failed,
      // or if apiMiddleware explicitly rejected the promise with an error that wasn't handled
      // by the onFailure callback. API errors are typically handled by `onFailure`
      // and update the Redux `error` state.
      console.error("Unexpected error during signup action dispatch:", err);
      // The useEffect listening to `error` in Redux will handle the modal display for API failures.
    }
  };


  return (
    <div className="signup-page-container">
      {loading && <Loader />} {/* Use Redux 'loading' state */}
      <div className="signup-card">
        <h2 className="signup-title">Join Electron Academy Today!</h2>
        <p className="signup-subtitle">
          Create your account to unlock exclusive courses and features.
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
              maxLength="10"
            />
            {errors.mobile && <span className="error-message-signup">{errors.mobile}</span>}
          </div>

          {/* Password field with toggle button */}
          <div className="form-group-signup password-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-button left"
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={`input-with-icon ${errors.password ? 'input-error' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.password && <span className="error-message-signup">{errors.password}</span>}
          </div>

          {/* Confirm Password field with toggle button */}
          <div className="form-group-signup password-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-icon-wrapper">
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="password-toggle-button left"
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            {errors.confirmPassword && (
              <span className="error-message-signup">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
            setModalOpen(false);
            // Optionally clear Redux error when user closes the modal manually
            if (error) {
                dispatch(setAuthError(null));
            }
        }}
        title={modalStatus === 'success' ? 'Success!' : 'Signup Failed!'}
        message={modalMessage}
        status={modalStatus}
        icon={modalStatus === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
      />
    </div>
  );
};

export default SignupPage;