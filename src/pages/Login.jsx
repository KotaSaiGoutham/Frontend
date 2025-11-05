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
import { loginUser,clearAuthError,clearCurrentStudent,setCurrentStudent } from "../redux/actions";

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
  
  const [activeTab, setActiveTab] = useState("student"); 
  
  const [isFading, setIsFading] = useState(false);

  const modalStatus = isAuthenticated ? "success" : "error";
  const modalMessage = isAuthenticated
    ? "Login successful! Redirecting..."
    : error?.message || error || "An unknown error occurred. Please try again.";
    
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setModalOpen(true);
    } else if (isAuthenticated && !loading) {
      setModalOpen(true);
      const timer = setTimeout(() => {
        setModalOpen(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error, isAuthenticated, loading, user]);

  useEffect(() => {
    if (user) {
      if (user.role === "student") {
        console.log("user",user)
              dispatch(setCurrentStudent(user));

        navigate(`/student/${user?.id}/profile`, {
          state: { studentData: user },
        });
      } else if (user.role === "admin" || user.role === "faculty") {
                dispatch(clearCurrentStudent());

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
  
  // --- NEW: Function to handle tab change with animation ---
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return; // Do nothing if clicking the same tab

    setIsFading(true); // Start fade-out
    
    // Wait for fade-out to complete (200ms) before changing content
    setTimeout(() => {
      setActiveTab(newTab); // Change content
      setIsFading(false); // Start fade-in
    }, 200); // This duration must match the CSS transition duration
  };

  // --- Dynamic content based on tab ---
  const title = activeTab === "student" ? "Student Login" : "Faculty Login";
  const subtitle =
    activeTab === "student"
      ? "Log in to continue your learning journey."
      : "Log in to manage your courses and students.";

  // --- Inline styles for tabs and animation ---
  const tabContainerStyle = {
    display: "flex",
    width: "100%",
    borderBottom: "1px solid #e0e0e0",
    position: "relative",
    marginBottom: "24px",
  };

  const tabStyle = {
    flex: 1,
    padding: "12px 0",
    textAlign: "center",
    cursor: "pointer",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "16px",
    fontWeight: "600",
    color: "#888", // Inactive color
    transition: "color 0.3s ease",
  };

  const activeTabStyle = {
    ...tabStyle,
    color: "#333", // Active color
  };

  const sliderStyle = {
    position: "absolute",
    bottom: "-1px", 
    height: "3px",
    backgroundColor: "#007bff", 
    width: "50%",
    left: activeTab === "student" ? "0%" : "50%",
    transition: "left 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)", 
  };
  
  // --- NEW: Inline style for the fading content wrapper ---
  const contentFadeStyle = {
    opacity: isFading ? 0 : 1,
    transition: "opacity 0.2s ease-in-out", // This duration must match the setTimeout
  };


  return (
    <div className="signup-page-container">
      <div className="signup-card">

        {/* --- Tabbed Interface --- */}
        <div style={tabContainerStyle}>
          <button
            type="button"
            style={activeTab === "student" ? activeTabStyle : tabStyle}
            // --- MODIFIED: Use new handler ---
            onClick={() => handleTabChange("student")}
          >
            Student Login
          </button>
          <button
            type="button"
            style={activeTab === "faculty" ? activeTabStyle : tabStyle}
            // --- MODIFIED: Use new handler ---
            onClick={() => handleTabChange("faculty")}
          >
            Faculty Login
          </button>
          <div style={sliderStyle}></div> {/* Animated slider */}
        </div>

        {/* --- NEW: Fading content wrapper --- */}
        <div style={contentFadeStyle}>
                  <p className="signup-subtitle">{subtitle}</p>
          
          {/* --- The Form Itself --- */}
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
        </div> {/* --- End of Fading Wrapper --- */}


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