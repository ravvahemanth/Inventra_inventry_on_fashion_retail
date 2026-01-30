import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validation (Rule 8)
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData);
      
      // Store user data (Rule 1 - Session Management)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('username', response.data.user.username);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">📦</div>
          <h1>Inventra</h1>
          <p className="brand-tagline">Smart Inventory Management System</p>
        </div>
        
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">Real-time Stock Monitoring</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">Intelligent Alert System</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">Complete Audit Trail</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">Role-based Access Control</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Welcome Back! 👋</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
                className="form-input"
                autoComplete="email"
              />
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
                placeholder="Enter your password"
                className="form-input"
                autoComplete="current-password"
              />
            </div>

            <div className="form-footer">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="arrow-icon">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="demo-accounts">
            <p className="demo-title">🎯 Try Demo Accounts:</p>
            <div className="demo-buttons">
              <button 
                className="demo-btn admin-btn"
                onClick={() => setFormData({ email: 'admin@inventra.com', password: 'admin123' })}
              >
                👑 Admin
              </button>
              
              
            </div>
          </div>

          <div className="auth-switch">
            <span>Don't have an account?</span>
            <Link to="/register" className="switch-link">Create Account →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
