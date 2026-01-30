import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import './Dashboard.css';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'Staff';
  const username = localStorage.getItem('username') || 'Staff';
  const userRole = getUserRole();
  const [showSidebar, setShowSidebar] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    products: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'STAFF') {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [userRole, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/staff');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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

          <div className="role-indicator-mobile" style={{ backgroundColor: '#38b2ac' }}>
            <span>👨‍💼</span>
            <span className="role-text">Fashion Staff</span>
          </div>

          <nav className="sidebar-nav">
            <a href="/dashboard" className="nav-item active">
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/fashion" className="nav-item">
              <span className="nav-icon">👗</span>
              <span>Fashion Collection</span>
            </a>
            <a href="/admin/alerts" className="nav-item">
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
              <h1>👗 Fashion Staff Dashboard</h1>
              <p className="topbar-subtitle">View fashion collection inventory and stock levels</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role" style={{ color: '#38b2ac' }}>
                👨‍💼 Fashion Staff
              </span>
            </div>
          </div>
        </div>

        {/* Fashion Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon blue">👗</div>
            <div className="stat-details">
              <h3>Fashion Products</h3>
              <p className="stat-number">{dashboardData.stats.totalProducts || 0}</p>
              <span className="stat-change positive">✓ Available to view</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">⚠️</div>
            <div className="stat-details">
              <h3>Low Stock Items</h3>
              <p className="stat-number">{dashboardData.stats.lowStockProducts || 0}</p>
              <span className="stat-change negative">⚠ Need attention</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">❌</div>
            <div className="stat-details">
              <h3>Out of Stock</h3>
              <p className="stat-number">{dashboardData.stats.outOfStockProducts || 0}</p>
              <span className="stat-change negative">❌ Immediate action needed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div className="stat-details">
              <h3>Available Products</h3>
              <p className="stat-number">
                {(dashboardData.stats.totalProducts || 0) - (dashboardData.stats.lowStockProducts || 0) - (dashboardData.stats.outOfStockProducts || 0)}
              </p>
              <span className="stat-change positive">✓ In good stock</span>
            </div>
          </div>
        </div>

        {/* Fashion Products Table */}
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
              👗 Fashion Collection ({dashboardData.products?.length || 0})
            </h2>
            <button 
              className="action-btn action-btn-primary"
              onClick={() => navigate('/fashion')}
              style={{ 
                padding: '8px 14px', 
                fontSize: '13px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #38b2ac, #319795)',
                color: 'white',
                border: 'none',
                borderRadius: '7px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                height: 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(56, 178, 172, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              👗 View Collection
            </button>
          </div>
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Season</th>
                  <th>Total Stock</th>
                  <th>Status</th>
                  <th>Base Price</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <strong>{product.name}</strong>
                        {product.description && <div className="product-desc">{product.description}</div>}
                      </div>
                    </td>
                    <td>
                      <span className="brand-badge">{product.brand || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="category-badge">{product.categoryDisplayName || product.category}</span>
                    </td>
                    <td>
                      <span className="season-badge">{product.seasonDisplayName || product.season}</span>
                    </td>
                    <td>
                      <span className={`stock-quantity ${
                        product.totalStock === 0 ? 'out-of-stock' : 
                        product.lowStock ? 'low-stock' : 'in-stock'
                      }`}>
                        {product.totalStock || product.quantity || 0}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        (product.totalStock || product.quantity) === 0 ? 'status-out' : 
                        product.lowStock ? 'status-low' : 'status-good'
                      }`}>
                        {(product.totalStock || product.quantity) === 0 ? 'Out of Stock' : 
                         product.lowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>₹{product.basePrice || product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;