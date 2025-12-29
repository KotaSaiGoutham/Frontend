import React, { useState, useEffect } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
 
import {
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
  FaUserSlash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError, clearCurrentStudent, setCurrentStudent } from "../redux/actions";

// --- MOBILE IMPORTS ---
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import BiometricPrompt from "../components/BiometricPrompt";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );
  
  // --- BIOMETRIC STATE ---
  const [showBioPrompt, setShowBioPrompt] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("student"); 
  const [isFading, setIsFading] = useState(false);

  const [deactivatedStudentInfo, setDeactivatedStudentInfo] = useState(null);

  const modalStatus = isAuthenticated ? "success" : "error";
  const modalMessage = isAuthenticated
    ? "Login successful! Redirecting..."
    : error?.message || error || "An unknown error occurred. Please try again.";
    console.log("modalMessage",modalMessage,error?.message, error )
    
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // --- MODAL & SUCCESS LOGIC ---
  useEffect(() => {
    if (error) {
      setModalOpen(true);
    } else if (isAuthenticated && !loading) {
      // Only show success modal if NOT showing biometric prompt
      if (!showBioPrompt) {
        setModalOpen(true);
        
        if (user?.deactivated !== true) {
          const timer = setTimeout(() => {
            setModalOpen(false);
          }, 1500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [error, isAuthenticated, loading, user, showBioPrompt]);

  // --- MAIN LOGIN HANDLER ---
  useEffect(() => {
    const handleLoginSuccess = async () => {
      if (!user || !isAuthenticated) return;

      console.log("LOGIN SUCCESS: User authenticated", user);
      if (user && isAuthenticated) {
        
        // 1. Handle Deactivation
        if (user.deactivated === true) {
          console.log("LOGIN ABORT: User is deactivated");
           setDeactivatedStudentInfo({
             name: user.Name || user.name,
             deactivatedAt: user.deactivatedAt,
             studentId: user.id
           });
           setModalOpen(true);
           dispatch(clearCurrentStudent());
           return;
        }

        // 2. ⚡ CHECK BIOMETRICS (Mobile Only)
        if (Capacitor.isNativePlatform()) {
console.log("PLATFORM: Native device detected. Checking Biometrics...");
          try {
            const result = await NativeBiometric.isAvailable();
          console.log("result",result)

            if (result.isAvailable) {
              // Check existing preferences
              const { value: hasSetup } = await Preferences.get({ key: 'bio_enabled' });
              const { value: hasDeclined } = await Preferences.get({ key: 'bio_declined' });
              console.log(`PREFERENCES: Enabled=${hasSetup}, Declined=${hasDeclined}`);

              // If user hasn't decided yet, ASK THEM
              if (!hasSetup && !hasDeclined) {
                console.log("ACTION: Triggering Biometric Prompt...");
                setPendingUser(user);
                setShowBioPrompt(true);
                return; // 🛑 PAUSE HERE: Wait for user interaction
              }
            }
          } catch (e) {
            console.log(e,"Biometrics not available on this device");
          }
        }
        console.log("user",user)
        // 3. If Web or Already Decided, proceed
        finalizeLogin(user);
      }
    };

    handleLoginSuccess();
  }, [user, navigate, dispatch, isAuthenticated]); // Added dependencies

// --- HELPER: FINALIZE LOGIN & REDIRECT ---
  const finalizeLogin = async (userData) => {
    // Save Token for Auto-Login
    try {
      // 1. Try getting token from localStorage
      let token = localStorage.getItem("token");
      
      // 2. Fallback: If not in localStorage yet, check if it's in the userData object
      // (Adjust 'token' to whatever your backend sends: 'token', 'accessToken', etc.)
      if (!token && userData?.token) {
        token = userData.token;
      }

      console.log("SAVING TOKEN TO PREFS:", token); // <--- DEBUG LOG

      if (token) {
        await Preferences.set({ key: 'user_token', value: token });
      } else {
        console.error("CRITICAL: No token found to save for biometric login!");
      }
    } catch (e) {
      console.error("Error saving token:", e);
    }

    // Role Based Redirect (Existing code...)
    if (userData.role === "student") {        
      dispatch(setCurrentStudent(userData));
      navigate(`/student/${userData?.id}/profile`, {
        state: { studentData: userData },
      });
    } else if (userData.role === "developer" || userData.role === "faculty") {
      dispatch(clearCurrentStudent());
      navigate("/dashboard");
    } else if (userData.role === "typist") {
      dispatch(clearCurrentStudent());
      navigate("/students");
    }
  };

  // --- HANDLER: ENABLE BIOMETRICS ---
  const handleEnableBio = async () => {
    try {
      await NativeBiometric.verifyIdentity({
        reason: "Enable biometric login",
        title: "Setup Biometrics",
        subtitle: "Confirm your identity",
        description: "Please authenticate to enable this feature"
      });

      await Preferences.set({ key: 'bio_enabled', value: 'true' });
      setShowBioPrompt(false);
      finalizeLogin(pendingUser);

    } catch (e) {
      console.log(e,"Setup failed/cancelled");
      setShowBioPrompt(false);
      finalizeLogin(pendingUser); // Proceed without enabling
    }
  };

  // --- HANDLER: SKIP BIOMETRICS ---
  const handleSkipBio = async () => {
    await Preferences.set({ key: 'bio_declined', value: 'true' });
    setShowBioPrompt(false);
    finalizeLogin(pendingUser);
  };

  // --- EXISTING FORM HELPERS ---
  const formatDeactivatedDate = (deactivatedAt) => {
    if (!deactivatedAt) return "Unknown date";
    try {
      const date = deactivatedAt._seconds 
        ? new Date(deactivatedAt._seconds * 1000)
        : new Date(deactivatedAt);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (error) { return "Unknown date"; }
  };

  const getDeactivationMessage = () => {
    if (!deactivatedStudentInfo) return "";
    const { name, deactivatedAt } = deactivatedStudentInfo;
    const formattedDate = formatDeactivatedDate(deactivatedAt);
    return `Student "${name}" has left the organization. Account was deactivated on ${formattedDate}. Please contact administration for more information.`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);
  const isValidMobile = (value) => /^[0-9]{10}$/.test(value);

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    if (!formData.username.trim()) {
      newErrors.username = "Email address or Mobile number is required";
      isValid = false;
    } else if (!isValidEmail(formData.username) && !isValidMobile(formData.username)) {
      newErrors.username = "Please enter a valid email address or 10-digit mobile number";
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
    if (!validateForm()) return;
    setDeactivatedStudentInfo(null);
    const loginPayload = { username: formData.username, password: formData.password };
    dispatch(loginUser(loginPayload));
  };
  
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setIsFading(true);
    setTimeout(() => { setActiveTab(newTab); setIsFading(false); }, 200);
  };

  // Styles
  const title = activeTab === "student" ? "Student Login" : "Faculty Login";
  const subtitle = activeTab === "student" ? "Log in to continue your learning journey." : "Log in to manage your courses and students.";
  const tabContainerStyle = { display: "flex", width: "100%", borderBottom: "1px solid #e0e0e0", position: "relative", marginBottom: "24px" };
  const tabStyle = { flex: 1, padding: "12px 0", textAlign: "center", cursor: "pointer", border: "none", backgroundColor: "transparent", fontSize: "16px", fontWeight: "600", color: "#888", transition: "color 0.3s ease" };
  const activeTabStyle = { ...tabStyle, color: "#333" };
  const sliderStyle = { position: "absolute", bottom: "-1px", height: "3px", backgroundColor: "#007bff", width: "50%", left: activeTab === "student" ? "0%" : "50%", transition: "left 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)" };
  const contentFadeStyle = { opacity: isFading ? 0 : 1, transition: "opacity 0.2s ease-in-out" };

  return (
    <div className="signup-page-container">
      <div className="signup-card">
        <div style={tabContainerStyle}>
          <button type="button" style={activeTab === "student" ? activeTabStyle : tabStyle} onClick={() => handleTabChange("student")}>Student Login</button>
          <button type="button" style={activeTab === "faculty" ? activeTabStyle : tabStyle} onClick={() => handleTabChange("faculty")}>Faculty Login</button>
          <div style={sliderStyle}></div>
        </div>

        <div style={contentFadeStyle}>
          <p className="signup-subtitle">{subtitle}</p>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group-signup">
              <label htmlFor="username">Email address or Mobile number</label>
              <input type="text" id="username" name="username" placeholder="Enter your email or mobile number" value={formData.username} onChange={handleChange} className={errors.username ? "input-error" : ""} />
              {errors.username && <span className="error-message-signup">{errors.username}</span>}
            </div>

            <div className="form-group-signup password-group">
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrapper">
                <button type="button" onClick={togglePasswordVisibility} className="password-toggle-button left">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className={`input-with-icon ${errors.password ? "input-error" : ""}`} />
              </div>
              {errors.password && <span className="error-message-signup">{errors.password}</span>}
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? <><FaSpinner className="spinner-icon" /><span style={{ marginLeft: "8px" }}>Logging In...</span></> : "Log In"}
            </button>
          </form>
        </div>

        <p className="login-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        <p className="login-link"><Link to="/forgot-password">Forgot Password?</Link></p>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Biometric Prompt */}
      <BiometricPrompt 
          isOpen={showBioPrompt}
          onEnable={handleEnableBio}
          onSkip={handleSkipBio}
      />

      {/* 2. Standard Success/Error Modal */}
      {!deactivatedStudentInfo && !showBioPrompt && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title={modalStatus === "success" ? "Success!" : "Login Failed!"}
          message={modalMessage}
          status={modalStatus}
          icon={modalStatus === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
        />
      )}

      {/* 3. Deactivated User Modal */}
      {deactivatedStudentInfo && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => { setModalOpen(false); setDeactivatedStudentInfo(null); }}
          title="Account Deactivated"
          message={getDeactivationMessage()}
          status="error"
          icon={<FaUserSlash />}
          showCloseButton={true}
          customStyle={{ backgroundColor: "#fff3f3", border: "1px solid #ffcdd2" }}
        />
      )}
    </div>
  );
};

export default LoginPage;