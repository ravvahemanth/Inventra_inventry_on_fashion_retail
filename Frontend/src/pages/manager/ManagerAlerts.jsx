import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import '../Dashboard/Dashboard.css';

const ManagerAlerts = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const username = localStorage.getItem('username') || 'Manager';
  const userEmail = localStorage.getItem('userEmail') || 'Manager';
  
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (userRole !== 'MANAGER') {
      navigate('/dashboard');
      return;
    }
    fetchAlerts();
  }, [userRole, navigate]);

  const fetchAlerts = async () => {
    try {
      const response = await axiosInstance.get('/alerts/active');
      console.log('Manager Alerts Response:', response.data);
      // ✅ Backend returns { success: true, message: "...", data: [...] }
      setAlerts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await axiosInstance.put(`/alerts/${alertId}/resolve`);
      fetchAlerts(); // Refresh data
      alert('Alert resolved successfully!');
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Error resolving alert: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="main-content">
          <div style={{textAlign: 'center', padding: '60px', color: '#a0aec0'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
            <p style={{fontSize: '18px', fontWeight: '600'}}>Loading alerts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${showSidebar ? 'active' : ''}`}>
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">👗</span>
              <h2>Fashion Retail</h2>
            </div>
            <button className="close-sidebar" onClick={() => setShowSidebar(false)}>✕</button>
          </div>

          <div className="role-indicator-mobile" style={{ backgroundColor: '#ed8936' }}>
            <span>👔</span>
            <span className="role-text">Fashion Manager</span>
          </div>

          <nav className="sidebar-nav">
            <a href="/dashboard" className="nav-item">
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/fashion" className="nav-item">
              <span className="nav-icon">👗</span>
              <span>Fashion Collection</span>
            </a>
            <a href="/admin/fashion-stock" className="nav-item">
              <span className="nav-icon">📦</span>
              <span>Stock Management</span>
            </a>
            <a href="/manager/alerts" className="nav-item active">
              <span className="nav-icon">🔔</span>
              <span>Stock Alerts</span>
            </a>
            <a href="/admin/transactions" className="nav-item">
              <span className="nav-icon">📝</span>
              <span>Transaction History</span>
            </a>
          </nav>

          <div className="sidebar-footer">
            <div className="user-info-sidebar">
              <div className="user-avatar-large">{username.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <p className="user-name-sidebar">{username}</p>
                <p className="user-email-sidebar">{userEmail}</p>
              </div>
            </div>
            <button className="logout-btn-sidebar" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setShowSidebar(true)}>
              ☰
            </button>
            <div className="page-title-dash">
              <h1>👗 Fashion Stock Alerts</h1>
              <p className="topbar-subtitle">Monitor fashion inventory alerts and take action</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role" style={{ color: '#ed8936' }}>
                👔 Fashion Manager
              </span>
            </div>
          </div>
        </div>

        {/* Fashion Alerts List */}
        <div className="recent-activity">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '700', color: '#1a202c' }}>
              🔔 Fashion Stock Alerts ({alerts.length})
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className="action-btn action-btn-primary"
                onClick={() => navigate('/admin/fashion-stock')}
                style={{ 
                  padding: '8px 14px', 
                  fontSize: '13px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                📦 Manage Stock
              </button>
              <button 
                className="action-btn action-btn-secondary"
                onClick={() => navigate('/fashion')}
                style={{ 
                  padding: '8px 14px', 
                  fontSize: '13px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                👗 View Collection
              </button>
            </div>
          </div>
          {alerts.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px', color: '#a0aec0'}}>
              <div style={{fontSize: '64px', marginBottom: '20px'}}>✅</div>
              <h3 style={{fontSize: '24px', fontWeight: '700', color: '#4a5568', marginBottom: '10px'}}>No active fashion alerts</h3>
              <p style={{fontSize: '16px'}}>All fashion products are well-stocked. Great job managing the collection!</p>
              <div style={{ marginTop: '20px' }}>
                <button 
                  className="action-btn action-btn-info"
                  onClick={() => navigate('/fashion')}
                  style={{ 
                    padding: '10px 20px', 
                    fontSize: '14px',
                    background: 'linear-gradient(135deg, #4299e1, #3182ce)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  👗 View Fashion Collection
                </button>
              </div>
            </div>
          ) : (
            <div className="activity-list">
              {alerts.map((alert) => (
                <div key={alert.id} className="activity-item-compact">
                  <div className={`activity-icon-compact ${alert.type === 'OUT_OF_STOCK' ? 'red' : 'orange'}`}>
                    {alert.type === 'OUT_OF_STOCK' ? '🚨' : '⚠️'}
                  </div>
                  <div className="activity-details-compact">
                    <p className="activity-text-compact">
                      <strong>{alert.productName || 'Fashion Product'}</strong> - {alert.message}
                    </p>
                    <span className="activity-time-compact">
                      {alert.type} Alert • {new Date(alert.createdAt).toLocaleString('en-IN')} • Status: {alert.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      className="action-btn-compact action-btn-info"
                      onClick={() => navigate('/admin/fashion-stock')}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      📦 Manage Stock
                    </button>
                    <button 
                      className="action-btn-compact action-btn-secondary"
                      onClick={() => navigate('/fashion')}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      👗 View Product
                    </button>
                    {alert.status === 'ACTIVE' && (
                      <button 
                        className="action-btn-compact action-btn-success"
                        onClick={() => handleResolveAlert(alert.id)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        ✓ Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Alert Summary */}
          {alerts.length > 0 && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#f7fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>📊 Alert Summary</h4>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <span style={{ color: '#e53e3e', fontWeight: '600' }}>
                  🚨 Out of Stock: {alerts.filter(a => a.type === 'OUT_OF_STOCK').length}
                </span>
                <span style={{ color: '#dd6b20', fontWeight: '600' }}>
                  ⚠️ Low Stock: {alerts.filter(a => a.type === 'LOW_STOCK').length}
                </span>
                <span style={{ color: '#38a169', fontWeight: '600' }}>
                  ✅ Active Alerts: {alerts.filter(a => a.status === 'ACTIVE').length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerAlerts;
