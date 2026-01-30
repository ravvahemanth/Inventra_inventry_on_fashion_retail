import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import './auth.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long!');
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ token, newPassword: formData.newPassword });
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Reset link expired or invalid. Please try again.');
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="error-message">
            <span className="error-icon">⚠️</span> Invalid reset link!
          </div>
          <button className="btn-primary" onClick={() => navigate('/forgot-password')}>
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card success-card">
          <div className="success-icon">✓</div>
          <h2>Password Reset Successfully!</h2>
          <p className="success-message">
            Your password has been updated. Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-circle">
            <span className="logo-text">🔑</span>
          </div>
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your new password below</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <span className="label-icon">🔒</span> New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password (min. 6 characters)"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon">🔒</span> Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="password-strength">
            {formData.newPassword.length > 0 && (
              <div className={`strength-indicator ${
                formData.newPassword.length < 6 ? 'weak' :
                formData.newPassword.length < 10 ? 'medium' : 'strong'
              }`}>
                Password Strength: {
                  formData.newPassword.length < 6 ? 'Weak' :
                  formData.newPassword.length < 10 ? 'Medium' : 'Strong'
                }
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
