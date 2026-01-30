import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout, getUserRole } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import '../Dashboard/Dashboard.css';

function AdminAlerts() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  const username = localStorage.getItem('username') || 'Admin';
  const userRole = getUserRole();
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const stats = {
    total: alerts.length,
    unread: alerts.filter(a => a.status === 'ACTIVE').length,
    lowStock: alerts.filter(a => a.type === 'LOW_STOCK' && a.status === 'ACTIVE').length,
    outOfStock: alerts.filter(a => a.type === 'OUT_OF_STOCK' && a.status === 'ACTIVE').length,
    resolved: alerts.filter(a => a.status === 'RESOLVED').length
  };

  useEffect(() => {
    if (userRole !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    loadAlerts();
  }, [userRole, navigate]);

  const loadAlerts = async () => {
    try {
      const response = await axiosInstance.get('/alerts');
      console.log('Admin Alerts Response:', response.data);
      // ✅ Backend returns { success: true, message: "...", data: [...] }
      setAlerts(response.data.data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await axiosInstance.put(`/alerts/${alertId}/resolve`);
      loadAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await axiosInstance.delete(`/alerts/${alertId}`);
        loadAlerts();
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : filter === 'unread' 
    ? alerts.filter(a => a.status === 'ACTIVE')
    : filter === 'LOW_STOCK'
    ? alerts.filter(a => a.type === 'LOW_STOCK')
    : filter === 'OUT_OF_STOCK'
    ? alerts.filter(a => a.type === 'OUT_OF_STOCK')
    : alerts;

  const getAlertIcon = (type) => {
    switch(type) {
      case 'LOW_STOCK': return '⚠️';
      case 'OUT_OF_STOCK': return '🚨';
      default: return '📢';
    }
  };

  const getAlertColor = (type) => {
    switch(type) {
      case 'OUT_OF_STOCK': return '#fc8181';
      case 'LOW_STOCK': return '#f6ad55';
      default: return '#9f7aea';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${showSidebar ? 'active' : ''}`}>
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">📦</span>
              <h2>Inventra</h2>
            </div>
            <button className="close-sidebar" onClick={() => setShowSidebar(false)}>✕</button>
          </div>

          <div className="role-indicator-mobile" style={{background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)'}}>
            <span>👑</span>
            <span className="role-text">Admin Panel</span>
          </div>

          <nav className="sidebar-nav">
            <a href="/dashboard" className="nav-item">
              <span className="nav-icon">🏠</span>
              <span>Dashboard</span>
            </a>
            <a href="/admin/users" className="nav-item">
              <span className="nav-icon">👥</span>
              <span>User Management</span>
            </a>
            <a href="/admin/products" className="nav-item">
              <span className="nav-icon">📦</span>
              <span>Products</span>
            </a>
            <a href="/admin/transactions" className="nav-item">
              <span className="nav-icon">📊</span>
              <span>Transactions</span>
            </a>
            <a href="/admin/alerts" className="nav-item active">
              <span className="nav-icon">🔔</span>
              <span>Alerts</span>
              {stats.unread > 0 && <span className="alert-badge-nav">{stats.unread}</span>}
            </a>
          </nav>

          <div className="sidebar-footer">
            <div className="user-info-sidebar">
              <div className="user-avatar-large">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <p className="user-name-sidebar">{username}</p>
                <p className="user-email-sidebar">{userEmail}</p>
              </div>
            </div>
            <button className="logout-btn-sidebar" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setShowSidebar(true)}>☰</button>
            <div className="page-title-dash">
              <h1>🔔 Alert Management</h1>
              <p className="topbar-subtitle">Monitor and manage system alerts</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="notification-bell">
              <span>🔔</span>
              {stats.unread > 0 && <span className="notification-count">{stats.unread}</span>}
            </div>
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{username}</div>
              <div className="user-role" style={{color: '#fc8181'}}>● Admin</div>
            </div>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <span>📊</span>
            </div>
            <div className="stat-details">
              <h3>Total Alerts</h3>
              <div className="stat-number">{stats.total}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <span>🔔</span>
            </div>
            <div className="stat-details">
              <h3>Unread Alerts</h3>
              <div className="stat-number">{stats.unread}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)', boxShadow: '0 8px 20px rgba(246, 173, 85, 0.3)'}}>
              <span>⚠️</span>
            </div>
            <div className="stat-details">
              <h3>Low Stock</h3>
              <div className="stat-number">{stats.lowStock}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)', boxShadow: '0 8px 20px rgba(252, 129, 129, 0.3)'}}>
              <span>🚨</span>
            </div>
            <div className="stat-details">
              <h3>Out of Stock</h3>
              <div className="stat-number">{stats.outOfStock}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <span>✅</span>
            </div>
            <div className="stat-details">
              <h3>Resolved</h3>
              <div className="stat-number">{stats.resolved}</div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div style={{padding: '0 35px 25px 35px'}}>
          <div style={{background: 'white', padding: '25px 30px', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)', marginBottom: '25px'}}>
            <h2 style={{fontSize: '20px', fontWeight: '800', color: '#1a202c', marginBottom: '20px'}}>Filter Alerts</h2>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '12px 24px',
                  border: filter === 'all' ? '2px solid #667eea' : '2px solid #e2e8f0',
                  background: filter === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                  color: filter === 'all' ? 'white' : '#4a5568',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: filter === 'all' ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                }}
              >
                📋 All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('unread')}
                style={{
                  padding: '12px 24px',
                  border: filter === 'unread' ? '2px solid #667eea' : '2px solid #e2e8f0',
                  background: filter === 'unread' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                  color: filter === 'unread' ? 'white' : '#4a5568',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: filter === 'unread' ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                }}
              >
                🔔 Unread ({stats.unread})
              </button>
              <button
                onClick={() => setFilter('LOW_STOCK')}
                style={{
                  padding: '12px 24px',
                  border: filter === 'LOW_STOCK' ? '2px solid #f6ad55' : '2px solid #e2e8f0',
                  background: filter === 'LOW_STOCK' ? 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)' : 'white',
                  color: filter === 'LOW_STOCK' ? 'white' : '#4a5568',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: filter === 'LOW_STOCK' ? '0 4px 15px rgba(246, 173, 85, 0.3)' : 'none'
                }}
              >
                ⚠️ Low Stock ({stats.lowStock})
              </button>
              <button
                onClick={() => setFilter('OUT_OF_STOCK')}
                style={{
                  padding: '12px 24px',
                  border: filter === 'OUT_OF_STOCK' ? '2px solid #fc8181' : '2px solid #e2e8f0',
                  background: filter === 'OUT_OF_STOCK' ? 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)' : 'white',
                  color: filter === 'OUT_OF_STOCK' ? 'white' : '#4a5568',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: filter === 'OUT_OF_STOCK' ? '0 4px 15px rgba(252, 129, 129, 0.3)' : 'none'
                }}
              >
                🚨 Out of Stock ({stats.outOfStock})
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)'}}>
            <h2 style={{fontSize: '24px', fontWeight: '800', color: '#1a202c', marginBottom: '25px'}}>
              {filter === 'all' ? 'All Alerts' : filter === 'unread' ? 'Unread Alerts' : `${filter.replace('_', ' ')} Alerts`} ({filteredAlerts.length})
            </h2>

            {loading ? (
              <div style={{textAlign: 'center', padding: '60px', color: '#a0aec0'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
                <p style={{fontSize: '18px', fontWeight: '600'}}>Loading alerts...</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div style={{textAlign: 'center', padding: '60px', color: '#a0aec0'}}>
                <div style={{fontSize: '64px', marginBottom: '20px'}}>✅</div>
                <h3 style={{fontSize: '24px', fontWeight: '700', color: '#4a5568', marginBottom: '10px'}}>No alerts found</h3>
                <p style={{fontSize: '16px'}}>
                  {filter === 'all' ? 'All clear! No alerts at the moment.' : `No ${filter.replace('_', ' ')} alerts.`}
                </p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      padding: '24px',
                      borderRadius: '14px',
                      border: `2px solid ${alert.status === 'RESOLVED' ? '#e2e8f0' : getAlertColor(alert.type)}`,
                      background: alert.status === 'RESOLVED' ? 'white' : `linear-gradient(135deg, ${getAlertColor(alert.type)}10 0%, ${getAlertColor(alert.type)}05 100%)`,
                      transition: 'all 0.3s',
                      boxShadow: alert.status === 'RESOLVED' ? '0 2px 8px rgba(0,0,0,0.05)' : `0 4px 15px ${getAlertColor(alert.type)}40`,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = `0 8px 25px ${getAlertColor(alert.type)}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = alert.status === 'RESOLVED' ? '0 2px 8px rgba(0,0,0,0.05)' : `0 4px 15px ${getAlertColor(alert.type)}40`;
                    }}
                  >
                    <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
                      <div style={{
                        fontSize: '48px',
                        flexShrink: '0',
                        opacity: alert.status === 'RESOLVED' ? '0.5' : '1',
                        transition: 'all 0.3s'
                      }}>
                        {getAlertIcon(alert.type)}
                      </div>

                      <div style={{flex: '1'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                          <div>
                            <h3 style={{
                              fontSize: '20px',
                              fontWeight: '800',
                              color: '#1a202c',
                              marginBottom: '6px',
                              textTransform: 'capitalize'
                            }}>
                              {alert.type.replace('_', ' ')}
                            </h3>
                            <p style={{fontSize: '15px', color: '#4a5568', margin: '0', fontWeight: '500'}}>
                              {alert.message}
                            </p>
                          </div>
                          {alert.status === 'ACTIVE' && (
                            <span style={{
                              background: getAlertColor(alert.type),
                              color: 'white',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              boxShadow: `0 4px 12px ${getAlertColor(alert.type)}40`
                            }}>
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <div style={{
                          background: 'rgba(102, 126, 234, 0.1)',
                          padding: '14px 18px',
                          borderRadius: '10px',
                          marginTop: '12px',
                          borderLeft: '4px solid #667eea'
                        }}>
                          <p style={{margin: '0', fontSize: '14px', color: '#2d3748'}}>
                            <strong style={{color: '#667eea'}}>Product:</strong> {alert.productName}
                          </p>
                          <p style={{margin: '6px 0 0 0', fontSize: '14px', color: '#4a5568'}}>
                            <strong>Product ID:</strong> {alert.productId}
                          </p>
                        </div>

                        <div style={{display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center'}}>
                          <span style={{fontSize: '13px', color: '#718096', fontWeight: '600'}}>
                            📅 {new Date(alert.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {alert.status === 'ACTIVE' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(alert.id);
                              }}
                              style={{
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.3)';
                              }}
                            >
                              ✓ Resolve
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAlert(alert.id);
                            }}
                            style={{
                              padding: '8px 16px',
                              background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              boxShadow: '0 4px 12px rgba(252, 129, 129, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(252, 129, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(252, 129, 129, 0.3)';
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAlerts;
