import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout, getUserRole } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import './Dashboard.css';

function ManagerDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'Manager';
  const username = localStorage.getItem('username') || 'Manager';
  const userRole = getUserRole();
  const [alertCount, setAlertCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    products: [],
    recentTransactions: [],
    alerts: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'MANAGER') {
      navigate('/dashboard');
      return;
    }
    loadManagerData();
  }, [userRole, navigate]);

  const loadManagerData = async () => {
    try {
      console.log('🔄 Loading manager dashboard data...');
      const response = await axiosInstance.get('/dashboard/manager');
      console.log('📊 Manager dashboard response:', response.data);
      
      setDashboardData(response.data);
      
      // ✅ FIX: Use only active alerts for count
      const activeAlerts = response.data.alerts || [];
      const activeAlertCount = activeAlerts.filter(alert => alert.status === 'ACTIVE').length;
      
      console.log(`🔔 Alert count: ${activeAlertCount} active alerts out of ${activeAlerts.length} total`);
      setAlertCount(activeAlertCount);
    } catch (error) {
      console.error('❌ Error loading manager data:', error);
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

  const handleStockUpdate = async (productId, type, quantity, reason) => {
    try {
      await axiosInstance.post('/stock-transactions', {
        productId,
        type,
        quantity,
        reason
      });
      loadManagerData(); // Refresh data
      alert(`Stock ${type === 'STOCK_IN' ? 'added' : 'removed'} successfully!`);
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock: ' + (error.response?.data?.message || error.message));
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
              <span className="logo-icon">📦</span>
              <h2>Inventra</h2>
            </div>
            <button className="close-sidebar" onClick={() => setShowSidebar(false)}>✕</button>
          </div>

          <div className="role-indicator-mobile" style={{ backgroundColor: '#667eea' }}>
            <span>👔</span>
            <span className="role-text">Manager</span>
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
            <a href="/manager/stock" className="nav-item">
              <span className="nav-icon">📦</span>
              <span>Manage Inventory</span>
            </a>
            <a href="/transactions" className="nav-item">
              <span className="nav-icon">📋</span>
              <span>Transaction History</span>
            </a>
            <a href="/manager/alerts" className="nav-item">
              <span className="nav-icon">🔔</span>
              <span>Stock Alerts</span>
              {alertCount > 0 && (
                <span className="alert-badge-nav">{alertCount}</span>
              )}
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
              <h1>👗 Fashion Retail Manager</h1>
              <p className="topbar-subtitle">Manage apparel, footwear & accessories inventory</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="notification-bell" onClick={() => navigate('/alerts')}>
              🔔
              {alertCount > 0 && <span className="notification-count">{alertCount}</span>}
            </div>
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role" style={{ color: '#667eea' }}>
                👔 Manager
              </span>
            </div>
          </div>
        </div>

        {/* Stock Alert Banner */}
        {alertCount > 0 && (
          <div className="alert-banner" onClick={() => navigate('/alerts')}>
            <div className="banner-icon">⚠️</div>
            <div className="banner-content">
              <h4>⚡ Fashion Alert!</h4>
              <p>You have {alertCount} active stock alert{alertCount > 1 ? 's' : ''} requiring immediate attention. Check fashion inventory levels now.</p>
            </div>
            <button className="banner-btn">View Stock Alerts →</button>
          </div>
        )}

        {/* Fashion Inventory Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon blue">👗</div>
            <div className="stat-details">
              <h3>Fashion Items</h3>
              <p className="stat-number">{dashboardData.stats.totalProducts || 0}</p>
              <span className="stat-change positive">✓ Active collection</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">⚠️</div>
            <div className="stat-details">
              <h3>Low Stock</h3>
              <p className="stat-number">{dashboardData.stats.lowStockProducts || 0}</p>
              <span className="stat-change negative">⚠ Needs restocking</span>
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
            <div className="stat-icon green">🔔</div>
            <div className="stat-details">
              <h3>Active Alerts</h3>
              <p className="stat-number">{dashboardData.stats.activeAlerts || 0}</p>
              <span className="stat-change positive">✓ Monitoring</span>
            </div>
          </div>
        </div>

        {/* Fashion Products Display - Main Dashboard */}
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
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(102, 126, 234, 0.3)';
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
                {(dashboardData.products || []).map((product) => (
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

        {/* Recent Transactions */}
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
              📋 Recent Stock Movements
            </h2>
            <button 
              className="action-btn action-btn-primary"
              onClick={() => navigate('/transactions')}
              style={{ 
                padding: '8px 14px', 
                fontSize: '13px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #4299e1, #3182ce)',
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
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(66, 153, 225, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📋 View All
            </button>
          </div>
          <div className="activity-list">
            {dashboardData.recentTransactions.map((transaction, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${transaction.type === 'STOCK_IN' ? 'green' : 'orange'}`}>
                  {transaction.type === 'STOCK_IN' ? '⬆️' : '⬇️'}
                </div>
                <div className="activity-details">
                  <p className="activity-text">
                    <strong>{transaction.productName}</strong> - {transaction.type === 'STOCK_IN' ? 'Added' : 'Removed'} {transaction.quantity} units
                  </p>
                  <span className="activity-time">
                    By {transaction.username} • {transaction.reason}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        {dashboardData.alerts && dashboardData.alerts.filter(alert => alert.status === 'ACTIVE').length > 0 && (
          <div className="recent-activity">
            <h2>🔔 Active Stock Alerts</h2>
            <div className="activity-list">
              {dashboardData.alerts
                .filter(alert => alert.status === 'ACTIVE')
                .map((alert, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon ${alert.type === 'OUT_OF_STOCK' ? 'red' : 'orange'}`}>
                    {alert.type === 'OUT_OF_STOCK' ? '🚨' : '⚠️'}
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>{alert.productName || 'Unknown Product'}</strong> - {alert.message}
                    </p>
                    <span className="activity-time">
                      {alert.type} Alert • {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="action-btn action-btn-warning" onClick={() => navigate('/alerts')}>
              View All Alerts →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;