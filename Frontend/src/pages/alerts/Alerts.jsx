import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import './Alerts.css';
import '../Dashboard/Dashboard.css';

function Alerts() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const username = localStorage.getItem('username') || 'User';
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    resolved: 0
  });

  const canResolve = userRole === 'ADMIN' || userRole === 'MANAGER';

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, filterType, filterStatus, searchTerm]);

  const loadAlerts = async () => {
    try {
      const response = await axiosInstance.get('/alerts/active');
      console.log('Alerts API Response:', response.data);
      
      // Handle the API response structure: { success: true, message: "...", data: [...] }
      const alertsData = response.data?.data || response.data || [];
      
      const alertsArray = Array.isArray(alertsData) ? alertsData : [];
      
      const sortedAlerts = alertsArray.sort((a, b) => 
        new Date(b.createdAt || b.timestamp || 0) - new Date(a.createdAt || a.timestamp || 0)
      );
      
      setAlerts(sortedAlerts);
      
      const statsData = {
        total: sortedAlerts.filter(a => a.status !== 'RESOLVED').length,
        lowStock: sortedAlerts.filter(a => a.status !== 'RESOLVED' && a.type === 'LOW_STOCK').length,
        outOfStock: sortedAlerts.filter(a => a.status !== 'RESOLVED' && a.type === 'OUT_OF_STOCK').length,
        resolved: sortedAlerts.filter(a => a.status === 'RESOLVED').length
      };
      setStats(statsData);
      
    } catch (error) {
      console.error('Error loading alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const getRoleDisplayName = () => {
    switch(userRole) {
      case 'ADMIN': return 'Fashion Administrator';
      case 'MANAGER': return 'Fashion Manager';
      case 'STAFF': return 'Fashion Staff';
      default: return 'Fashion User';
    }
  };

  const getRoleEmoji = () => {
    switch(userRole) {
      case 'ADMIN': return '👑';
      case 'MANAGER': return '👔';
      case 'STAFF': return '👨‍💼';
      default: return '👤';
    }
  };

  const getRoleColor = () => {
    switch(userRole) {
      case 'ADMIN': return '#9f7aea';
      case 'MANAGER': return '#ed8936';
      case 'STAFF': return '#38b2ac';
      default: return '#4a5568';
    }
  };

  const filterAlerts = () => {
    let filtered = [...alerts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'ALL') {
      filtered = filtered.filter(a => a.type === filterType);
    }

    // Status filter
    if (filterStatus === 'ACTIVE') {
      filtered = filtered.filter(a => a.status === 'ACTIVE');
    } else if (filterStatus === 'RESOLVED') {
      filtered = filtered.filter(a => a.status === 'RESOLVED');
    }

    setFilteredAlerts(filtered);
  };

  const getAlertInfo = (alertType) => {
    switch (alertType) {
      case 'LOW_STOCK':
        return {
          icon: '⚠️',
          label: 'LOW STOCK',
          color: 'orange',
          priority: 'MEDIUM',
          description: 'Stock level is below minimum threshold'
        };
      case 'OUT_OF_STOCK':
        return {
          icon: '🚨',
          label: 'OUT OF STOCK',
          color: 'red',
          priority: 'HIGH',
          description: 'Product is completely out of stock'
        };
      default:
        return {
          icon: 'ℹ️',
          label: 'INFO',
          color: 'blue',
          priority: 'LOW',
          description: 'General information'
        };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleResolveAlert = async (alert) => {
    if (!canResolve) {
      window.alert('Only Managers and Admins can resolve alerts');
      return;
    }

    const confirmMsg = `Are you sure you want to resolve this alert for "${alert.productName}"?\n\nMake sure the stock has been replenished.`;
    
    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      await axiosInstance.put(`/alerts/${alert.id}/resolve`);
      await loadAlerts();
      if (showModal) {
        setShowModal(false);
      }
    } catch (error) {
      window.alert('Failed to resolve alert: ' + (error.response?.data?.message || error.message));
    }
  };

  const viewAlertDetails = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

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

          <div className="role-indicator-mobile" style={{ backgroundColor: getRoleColor() }}>
            <span>{getRoleEmoji()}</span>
            <span className="role-text">{getRoleDisplayName()}</span>
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
            {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
              <a href="/fashion/add-product" className="nav-item">
                <span className="nav-icon">➕</span>
                <span>Add Fashion Items</span>
              </a>
            )}
            {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
              <a href="/admin/fashion-stock" className="nav-item">
                <span className="nav-icon">📦</span>
                <span>Stock Management</span>
              </a>
            )}
            <a href="/admin/alerts" className="nav-item active">
              <span className="nav-icon">🔔</span>
              <span>Stock Alerts</span>
              {stats.total > 0 && (
                <span className="alert-badge-nav">{stats.total}</span>
              )}
            </a>
            {userRole === 'ADMIN' && (
              <a href="/admin/users" className="nav-item">
                <span className="nav-icon">👥</span>
                <span>User Management</span>
              </a>
            )}
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
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
            <div className="page-title-dash">
              <h1>🔔 Alert Center</h1>
              <p className="topbar-subtitle">Fashion retail stock alert management system</p>
            </div>
          </div>
          <div className="user-profile">
            {stats.total > 0 && (
              <div className="notification-bell">
                🔔
                <span className="notification-count">{stats.total}</span>
              </div>
            )}
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role" style={{ color: getRoleColor() }}>
                {getRoleEmoji()} {getRoleDisplayName()}
              </span>
            </div>
          </div>
        </div>

        <div className="alerts-content">
          {/* Stack Info Banner */}
          <div className="stack-info-banner">
            <div className="banner-icon">📚</div>
            <div className="banner-content">
              <h4>🎯 Stack-Based Alert System (LIFO)</h4>
              <p>
                <strong>Fashion Retail Implementation:</strong> Alerts use Stack data structure (Last-In-First-Out). 
                Duplicate alerts for the same product are prevented using Stack.peek() - 
                only new alerts for different products are pushed. This prevents alert flooding!
              </p>
            </div>
          </div>

      {/* Statistics Cards */}
      <div className="alerts-stats">
        <div className="stat-card stat-card-hover" onClick={() => { setFilterStatus('ACTIVE'); setFilterType('ALL'); }}>
          <div className="stat-icon red">🔔</div>
          <div className="stat-details">
            <h3>Active Alerts</h3>
            <p className="stat-number">{stats.total}</p>
            <span className="stat-label">Requires attention</span>
          </div>
        </div>

        <div className="stat-card stat-card-hover" onClick={() => { setFilterStatus('ACTIVE'); setFilterType('LOW_STOCK'); }}>
          <div className="stat-icon orange">⚠️</div>
          <div className="stat-details">
            <h3>Low Stock</h3>
            <p className="stat-number">{stats.lowStock}</p>
            <span className="stat-label">Below threshold</span>
          </div>
        </div>

        <div className="stat-card stat-card-hover" onClick={() => { setFilterStatus('ACTIVE'); setFilterType('OUT_OF_STOCK'); }}>
          <div className="stat-icon red">🔴</div>
          <div className="stat-details">
            <h3>Out of Stock</h3>
            <p className="stat-number">{stats.outOfStock}</p>
            <span className="stat-label">Critical priority</span>
          </div>
        </div>

        <div className="stat-card stat-card-hover" onClick={() => setFilterStatus('RESOLVED')}>
          <div className="stat-icon green">✓</div>
          <div className="stat-details">
            <h3>Resolved</h3>
            <p className="stat-number">{stats.resolved}</p>
            <span className="stat-label">Completed actions</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="alerts-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by product name or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Alert Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="LOW_STOCK">Low Stock Only</option>
            <option value="OUT_OF_STOCK">Out of Stock Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ACTIVE">Active Alerts</option>
            <option value="RESOLVED">Resolved Alerts</option>
            <option value="ALL">All Alerts</option>
          </select>
        </div>
      </div>

          {/* Alerts List */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading alerts...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                {filterStatus === 'ACTIVE' ? '🎉' : '📋'}
              </div>
              <h3>
                {filterStatus === 'ACTIVE' 
                  ? 'No Active Alerts!' 
                  : 'No Alerts Found'}
              </h3>
              <p>
                {filterStatus === 'ACTIVE'
                  ? 'All fashion products are well-stocked. Great job!'
                  : 'Try adjusting your filters or search criteria'}
              </p>
            </div>
          ) : (
            <div className="alerts-list">
              {filteredAlerts.map((alert, index) => {
                const alertInfo = getAlertInfo(alert.type);
                return (
                  <div 
                    key={alert.id} 
                    className={`alert-card alert-card-${alertInfo.color} ${alert.status === 'RESOLVED' ? 'alert-resolved' : ''}`}
                  >
                    {/* Stack Position Indicator */}
                    <div className="stack-position">
                      <span className="stack-badge">
                        Stack Position: {index + 1}
                      </span>
                      {index === 0 && (
                        <span className="top-stack-badge">
                          📌 TOP (peek)
                        </span>
                      )}
                    </div>

                    <div className="alert-card-header">
                      <div className="alert-icon-large">
                        {alertInfo.icon}
                      </div>
                      <div className="alert-header-info">
                        <div className="alert-badges">
                          <span className={`alert-type-badge badge-${alertInfo.color}`}>
                            {alertInfo.label}
                          </span>
                          <span className={`priority-badge priority-${alertInfo.priority.toLowerCase()}`}>
                            {alertInfo.priority} PRIORITY
                          </span>
                          {alert.status === 'RESOLVED' && (
                            <span className="resolved-badge">
                              ✓ RESOLVED
                            </span>
                          )}
                        </div>
                        <h3 className="alert-product-name">{alert.productName || 'Fashion Product'}</h3>
                        <p className="alert-message">{alert.message}</p>
                      </div>
                    </div>

                    <div className="alert-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">🆔 Alert ID</span>
                        <span className="detail-value">#{alert.id}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">👗 Product ID</span>
                        <span className="detail-value">#{alert.productId}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">📊 Alert Type</span>
                        <span className="detail-value">{alert.type}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">📋 Status</span>
                        <span className="detail-value">{alert.status}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">🕐 Created</span>
                        <span className="detail-value">{formatTimeAgo(alert.createdAt)}</span>
                      </div>
                    </div>

                    <div className="alert-actions">
                      <button 
                        className="btn-view-details"
                        onClick={() => viewAlertDetails(alert)}
                      >
                        <span>👁️</span>
                        <span>View Details</span>
                      </button>
                      
                      {alert.status === 'ACTIVE' && canResolve && (
                        <button 
                          className="btn-resolve"
                          onClick={() => handleResolveAlert(alert)}
                        >
                          <span>✓</span>
                          <span>Resolve Alert</span>
                        </button>
                      )}
                      
                      <button 
                        className="btn-view-product"
                        onClick={() => navigate('/fashion')}
                      >
                        <span>👗</span>
                        <span>View Fashion Collection</span>
                      </button>
                      
                      {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                        <button 
                          className="btn-manage-stock"
                          onClick={() => navigate('/admin/fashion-stock')}
                        >
                          <span>📦</span>
                          <span>Manage Stock</span>
                        </button>
                      )}
                    </div>

                    {/* Fashion Alert Information */}
                    {alert.status === 'ACTIVE' && (
                      <div className="threshold-info">
                        <div className="fashion-alert-info">
                          <p className="threshold-text">
                            <strong>Fashion Alert:</strong> {alert.message}
                          </p>
                          <div className="alert-priority-indicator">
                            <span className={`priority-dot priority-${alertInfo.priority.toLowerCase()}`}></span>
                            <span>{alertInfo.priority} Priority - {alertInfo.description}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Alert Details Modal */}
      {showModal && selectedAlert && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔍 Alert Details</h2>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="alert-detail-section">
                <h3>📋 Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-key">Alert ID:</span>
                    <span className="detail-val">#{selectedAlert.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Product Name:</span>
                    <span className="detail-val">{selectedAlert.productName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Product ID:</span>
                    <span className="detail-val">#{selectedAlert.productId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Alert Type:</span>
                    <span className="detail-val">{getAlertInfo(selectedAlert.type).label}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Status:</span>
                    <span className="detail-val">{selectedAlert.status}</span>
                  </div>
                </div>
              </div>

              <div className="alert-detail-section">
                <h3>⏰ Timeline</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-key">Alert Created:</span>
                    <span className="detail-val">{new Date(selectedAlert.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                  {selectedAlert.status === 'RESOLVED' && (
                    <div className="detail-row">
                      <span className="detail-key">Status:</span>
                      <span className="detail-val">✅ Resolved</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="alert-detail-section">
                <h3>💬 Message</h3>
                <p className="alert-full-message">{selectedAlert.message}</p>
              </div>

              {selectedAlert.status === 'ACTIVE' && canResolve && (
                <div className="modal-actions">
                  <button 
                    className="btn-resolve-large"
                    onClick={() => handleResolveAlert(selectedAlert)}
                  >
                    <span>✓</span>
                    <span>Mark as Resolved</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;
