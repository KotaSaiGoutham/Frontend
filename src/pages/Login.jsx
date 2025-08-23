import React, { useState, useEffect } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";

// Adjust paths as needed
import Loader from "./Loader"; // Assuming components folder
import Modal from "./Modal"; // Assuming components folder
import {
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser,clearAuthError } from "../redux/actions";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const modalStatus = isAuthenticated ? "success" : "error";
  const modalMessage = isAuthenticated
    ? "Login successful! Redirecting..."
    : error?.message || error || "An unknown error occurred. Please try again.";
useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);
  // This is the useEffect that was commented out.
  useEffect(() => {
    // This part is for debugging and can be kept or removed
    console.log(
      "LoginPage - isAuthenticated:",
      isAuthenticated,
      "error:",
      error,
      "loading:",
      loading,
      "user:",
      user
    );

    // This checks for an error and opens the modal
    if (error) {
      setModalOpen(true);
    } else if (isAuthenticated && !loading) {
      // This part handles a successful login
      setModalOpen(true);
      const timer = setTimeout(() => {
        setModalOpen(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error, isAuthenticated, loading, user]); // Added 'user' to the dependency array

  useEffect(() => {
    if (user) {
      if (user.role === "student") {
        navigate(`/student/${user.id}`, {
          state: { studentData: user },
        });
      } else if (user.role === "admin" || user.role === "faculty") {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isValidEmail = (value) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const isValidMobile = (value) => {
    return /^[0-9]{10}$/.test(value);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Email address or Mobile number is required";
      isValid = false;
    } else if (
      !isValidEmail(formData.username) &&
      !isValidMobile(formData.username)
    ) {
      newErrors.username =
        "Please enter a valid email address or 10-digit mobile number";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
    const loginPayload = {
      username: formData.username,
      password: formData.password,
    };

    dispatch(loginUser(loginPayload));
  };

  return (
    <div className="signup-page-container">
      <div className="signup-card">
        <h2 className="signup-title">Welcome Back!</h2>
        <p className="signup-subtitle">
          Log in to continue your learning journey and manage your account.
        </p>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group-signup">
            <label htmlFor="username">Email address or Mobile number</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your email or mobile number"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && (
              <span className="error-message-signup">{errors.username}</span>
            )}
          </div>

          <div className="form-group-signup password-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-button left"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`input-with-icon ${
                  errors.password ? "input-error" : ""
                }`}
              />
            </div>
            {errors.password && (
              <span className="error-message-signup">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner-icon" />
                <span style={{ marginLeft: "8px" }}>Logging In...</span>
              </>
            ) : (
              "Log In"
            )}
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
        title={modalStatus === "success" ? "Success!" : "Login Failed!"}
        message={modalMessage}
        status={modalStatus}
        icon={
          modalStatus === "success" ? <FaCheckCircle /> : <FaExclamationCircle />
        }
      />
    </div>
  );
};

export default LoginPage;