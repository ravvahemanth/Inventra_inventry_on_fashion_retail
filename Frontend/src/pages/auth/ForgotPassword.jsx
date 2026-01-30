import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOtp, resetPassword } from '../../services/authService';
import './auth.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.data.success) {
        setStep(2);
        setOtpTimer(600); // 10 minutes
        setCanResendOtp(false);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp(email, otp);
      if (response.data.success) {
        setStep(3);
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword.trim()) {
      setError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(email, otp, newPassword, confirmPassword);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return;
    
    setError('');
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.data.success) {
        setOtpTimer(600); // 10 minutes
        setCanResendOtp(false);
        setOtp('');
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="auth-container">
      {/* LEFT PANEL - Features */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">🔐</div>
          <h1>Password Recovery</h1>
          <p className="brand-tagline">Reset your account password securely with OTP</p>
        </div>
        
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">📧</span>
            <span className="feature-text">Email OTP Verification</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <span className="feature-text">Secure 6-Digit Code</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏰</span>
            <span className="feature-text">10-Minute Validity</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <span className="feature-text">Account Protection</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          {success ? (
            <div className="success-message-card">
              <div className="success-icon-large">✓</div>
              <h3>Password Reset Successful!</h3>
              <p className="success-description">
                Your password has been successfully reset.
              </p>
              <div className="success-instructions">
                <p>🔐 Your new password is now active</p>
                <p>🔗 You can now login with your new password</p>
                <p>📧 A confirmation email has been sent</p>
              </div>
              <div className="redirect-message">
                Redirecting to login page in 3 seconds...
              </div>
            </div>
          ) : (
            <>
              {/* Step Indicator */}
              <div className="step-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Email</span>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">OTP</span>
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">New Password</span>
                </div>
              </div>

              <div className="auth-header">
                <h2>
                  {step === 1 && 'Enter Your Email 📧'}
                  {step === 2 && 'Verify OTP 🔢'}
                  {step === 3 && 'Set New Password 🔑'}
                </h2>
                <p>
                  {step === 1 && 'Enter your email to receive a 6-digit OTP'}
                  {step === 2 && 'Enter the OTP sent to your email'}
                  {step === 3 && 'Create your new secure password'}
                </p>
              </div>

              {error && (
                <div className="error-banner">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Email Input */}
              {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="email">
                      <span className="label-icon">📧</span>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter your registered email"
                      className={`form-input ${error ? 'input-error' : ''}`}
                      autoComplete="email"
                      autoFocus
                    />
                    <span className="input-hint">
                      Enter the email address associated with your account
                    </span>
                  </div>

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-small"></span>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <span className="arrow-icon">→</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: OTP Input */}
              {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="otp">
                      <span className="label-icon">🔢</span>
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                        setError('');
                      }}
                      placeholder="Enter 6-digit OTP"
                      className={`form-input otp-input ${error ? 'input-error' : ''}`}
                      maxLength="6"
                      autoComplete="one-time-code"
                      autoFocus
                    />
                    <span className="input-hint">
                      OTP sent to {email}
                      {otpTimer > 0 && (
                        <span className="timer"> • Expires in {formatTime(otpTimer)}</span>
                      )}
                    </span>
                  </div>

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-small"></span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <span>Verify OTP</span>
                        <span className="arrow-icon">→</span>
                      </>
                    )}
                  </button>

                  <div className="resend-section">
                    <span>Didn't receive the OTP?</span>
                    <button
                      type="button"
                      className={`resend-btn ${canResendOtp ? 'active' : 'disabled'}`}
                      onClick={handleResendOtp}
                      disabled={!canResendOtp || loading}
                    >
                      {canResendOtp ? 'Resend OTP' : `Resend in ${formatTime(otpTimer)}`}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <form onSubmit={handlePasswordReset} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="newPassword">
                      <span className="label-icon">🔒</span>
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter new password"
                      className={`form-input ${error ? 'input-error' : ''}`}
                      autoComplete="new-password"
                      autoFocus
                    />
                    <span className="input-hint">
                      Password must be at least 6 characters long
                    </span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <span className="label-icon">🔒</span>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Confirm new password"
                      className={`form-input ${error ? 'input-error' : ''}`}
                      autoComplete="new-password"
                    />
                    <span className="input-hint">
                      Re-enter your new password to confirm
                    </span>
                  </div>

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-small"></span>
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <span className="arrow-icon">→</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <div className="help-section">
                <div className="help-card">
                  <div className="help-icon">💡</div>
                  <div className="help-content">
                    <h4>Need Help?</h4>
                    <p>
                      {step === 1 && 'Make sure to enter the email address you used to register'}
                      {step === 2 && 'Check your email inbox and spam folder for the OTP'}
                      {step === 3 && 'Choose a strong password with at least 6 characters'}
                    </p>
                    <ul className="help-list">
                      {step === 1 && (
                        <>
                          <li>Check your email address spelling</li>
                          <li>Ensure you have an active account</li>
                          <li>Contact support if issues persist</li>
                        </>
                      )}
                      {step === 2 && (
                        <>
                          <li>OTP is valid for 10 minutes only</li>
                          <li>You have 3 attempts to enter correct OTP</li>
                          <li>Request new OTP if expired</li>
                        </>
                      )}
                      {step === 3 && (
                        <>
                          <li>Use a mix of letters and numbers</li>
                          <li>Avoid common passwords</li>
                          <li>Keep your password secure</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="auth-switch">
                <span>Remember your password?</span>
                <Link to="/login" className="switch-link">Back to Login →</Link>
              </div>

              <div className="auth-switch" style={{ marginTop: '10px' }}>
                <span>Don't have an account?</span>
                <Link to="/register" className="switch-link">Create Account →</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
