import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear specific error when user types
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Rule 8: Frontend Validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || 'Registration failed. Please try again.'
      });
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">📦</div>
          <h1>Inventra</h1>
          <p className="brand-tagline">Start Managing Your Inventory Smartly</p>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">🚀</span>
            <span className="feature-text">Quick & Easy Setup</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔐</span>
            <span className="feature-text">Secure Authentication</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Powerful Analytics</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Real-time Updates</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Create Account 🎉</h2>
            <p>Join Inventra and streamline your inventory</p>
          </div>

          {success && (
            <div className="success-banner">
              <span className="success-icon">✓</span>
              <span>Account created successfully! Redirecting to login...</span>
            </div>
          )}

          {errors.submit && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`form-input ${errors.username ? 'input-error' : ''}`}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <span className="label-icon">🎭</span>
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
              >
                <option value="staff">User (View Inventory)</option>
                <option value="manager">Manager (Manage Stock)</option>
              </select>
              <div className="role-info">
                <small>
                  {formData.role === 'staff' ?
                    '✓ Staff accounts are approved automatically' :
                    '⏳ Manager accounts require admin approval'
                  }
                </small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <span className="label-icon">🔐</span>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn-submit" disabled={loading || success}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating Account...
                </>
              ) : success ? (
                <>
                  <span className="success-icon">✓</span>
                  Account Created!
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="arrow-icon">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-switch">
            <span>Already have an account?</span>
            <Link to="/login" className="switch-link">Sign In →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
