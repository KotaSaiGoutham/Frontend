import React, { useState } from 'react';
import './ForgotPassword.css'; // Don't forget this CSS file

const ForgotPassword = () => {
  // State for different steps of the process
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  // Form input states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI feedback states
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendOtpCountdown, setResendOtpCountdown] = useState(0);

  // --- Step 1: Send OTP (Email Submission) ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to send OTP
      // In a real app:
      // const response = await fetch('/api/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();
      // if (response.ok) { ... } else { throw new Error(...) }

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Assume OTP sent successfully
      setMessage('OTP sent to your email. Please check your inbox.');
      setCurrentStep(2); // Move to OTP verification step
      startResendCountdown();

    } catch (err) {
      console.error('Send OTP failed:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 2: Verify OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    if (otp.length !== 6 || !/^\d+$/.test(otp)) { // Assuming 6-digit numeric OTP
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to verify OTP
      // In a real app:
      // const response = await fetch('/api/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, otp }),
      // });
      // const data = await response.json();
      // if (response.ok) { ... } else { throw new Error(...) }

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // For demonstration: Assume OTP "123456" is valid
      if (otp === '123456') {
        setMessage('OTP verified successfully! Please set your new password.');
        setCurrentStep(3); // Move to new password step
      } else {
        throw new Error('Invalid OTP. Please try again.');
      }

    } catch (err) {
      console.error('OTP verification failed:', err);
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 3: Reset Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!newPassword || !confirmNewPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to reset password
      // In a real app:
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, newPassword }), // You might send a token here too
      // });
      // const data = await response.json();
      // if (response.ok) { ... } else { throw new Error(...) }

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      setMessage('Your password has been reset successfully! Redirecting to login...');
      // Clear all states and reset step after success
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setCurrentStep(1); // Reset to first step

      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login'; // Use window.location for full redirect
      }, 3000);

    } catch (err) {
      console.error('Password reset failed:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Resend OTP Logic ---
  const startResendCountdown = () => {
    setResendOtpCountdown(60); // 60 seconds countdown
    const countdownInterval = setInterval(() => {
      setResendOtpCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = () => {
    // This will essentially re-run handleSendOtp, but without form submission
    // For simplicity, we'll just call the function directly.
    // In a real app, you might have a separate resend-otp API endpoint.
    if (resendOtpCountdown === 0 && !isLoading) {
      handleSendOtp({ preventDefault: () => {} }); // Pass dummy event
      setMessage('OTP resent. Please check your inbox.');
    }
  };


  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Forgot Your Password?</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message-signup">{error}</p>}

        {/* Step 1: Enter Email */}
        {currentStep === 1 && (
          <form onSubmit={handleSendOtp}>
            <p>Enter your email address to receive an OTP for password reset.</p>
            <div className="form-group-signup">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {currentStep === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p>An OTP has been sent to <strong>{email}</strong>. Please enter it below.</p>
            <div className="form-group-signup">
              <label htmlFor="otp">One-Time Password (OTP)</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
            <p className="resend-otp-text">
              Didn't receive OTP?{' '}
              {resendOtpCountdown > 0 ? (
                <span>Resend in {resendOtpCountdown}s</span>
              ) : (
                <a href="#" onClick={handleResendOtp} className={isLoading ? 'disabled-link' : ''}>Resend OTP</a>
              )}
            </p>
          </form>
        )}

        {/* Step 3: Set New Password */}
        {currentStep === 3 && (
          <form onSubmit={handleResetPassword}>
            <p>Please set your new password.</p>
            <div className="form-group-signup">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 chars)"
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group-signup">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="back-to-login">
          Remembered your password? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;