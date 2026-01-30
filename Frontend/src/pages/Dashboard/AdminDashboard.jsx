import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout, getUserRole } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import './Dashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  const username = localStorage.getItem('username') || 'Admin';
  const userRole = getUserRole();
  const [dashboardData, setDashboardData] = useState({
    products: [],
    recentTransactions: [],
    alerts: [],
    stats: {}
  });
  const [fashionProducts, setFashionProducts] = useState([]);
  const [fashionStats, setFashionStats] = useState({
    totalProducts: 0,
    totalBrands: 0,
    totalVariants: 0,
    currentSeasonProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('products'); // 'products' or 'transactions'
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (userRole !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    loadAdminData();
    loadFashionData();
  }, [userRole, navigate]);

  const loadAdminData = async () => {
    try {
      // Load admin dashboard data
      const dashboardResponse = await axiosInstance.get('/dashboard/admin');
      setDashboardData(dashboardResponse.data);
      setAlertCount(dashboardResponse.data.alerts?.length || 0);

      // Load pending users (only managers need approval)
      const pendingResponse = await axiosInstance.get('/admin/pending-users');
      setPendingUsers(pendingResponse.data.users || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadFashionData = async () => {
    try {
      // Load fashion products
      const fashionResponse = await axiosInstance.get('/fashion-products');
      const products = fashionResponse.data || [];
      setFashionProducts(products);

      // Calculate fashion-specific stats
      const brands = [...new Set(products.map(p => p.brand))];
      const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0);
      const currentSeasonProducts = products.filter(p => 
        p.season === getCurrentSeason() || p.season === 'ALL_SEASON'
      ).length;
      const lowStockProducts = products.filter(p => p.lowStock).length;
      const outOfStockProducts = products.filter(p => p.outOfStock).length;

      setFashionStats({
        totalProducts: products.length,
        totalBrands: brands.length,
        totalVariants,
        currentSeasonProducts,
        lowStockProducts,
        outOfStockProducts
      });
    } catch (error) {
      console.error('Error loading fashion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) return 'SPRING';
    if (month >= 6 && month <= 8) return 'SUMMER';
    if (month >= 9 && month <= 11) return 'AUTUMN';
    return 'WINTER';
  };

  const [alertCount, setAlertCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleApproveUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}/status`, {
        status: 'approved'
      });
      loadAdminData(); // Refresh data
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}/status`, {
        status: 'rejected'
      });
      loadAdminData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleExportFashionProducts = async () => {
    setExporting(true);
    try {
      const response = await axiosInstance.get('/admin/fashion-products/export', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `fashion_products_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('✅ Fashion products exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      // Fallback to legacy products export
      try {
        const response = await axiosInstance.get('/admin/products/export', {
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('✅ Products exported successfully!');
      } catch (fallbackError) {
        console.error('Fallback export error:', fallbackError);
        alert('❌ Failed to export products');
      }
    } finally {
      setExporting(false);
      setShowExportModal(false);
    }
  };

  const handleExportTransactions = async () => {
    setExporting(true);
    try {
      let url = '/admin/transactions/export';
      if (dateRange.start && dateRange.end) {
        url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
      }
      
      const response = await axiosInstance.get(url, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const downloadUrl = URL.createObjectURL(blob);
      
      link.setAttribute('href', downloadUrl);
      const fileName = dateRange.start && dateRange.end 
        ? `transactions_${dateRange.start}_to_${dateRange.end}.csv`
        : `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      alert('✅ Transactions exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export transactions');
    } finally {
      setExporting(false);
      setShowExportModal(false);
    }
  };

  const openExportModal = (type) => {
    setExportType(type);
    setShowExportModal(true);
    setDateRange({ start: '', end: '' });
  };

  const getCategoryIcon = (category) => {
    if (category?.includes('CLOTHING')) return '👕';
    if (category?.includes('FOOTWEAR')) return '👟';
    if (category?.includes('ACCESSORIES')) return '👜';
    return '👗';
  };

  const getSeasonEmoji = (season) => {
    const seasonEmojis = {
      'SPRING': '🌸',
      'SUMMER': '☀️',
      'AUTUMN': '🍂',
      'WINTER': '❄️',
      'ALL_SEASON': '🌍'
    };
    return seasonEmojis[season] || '🌍';
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

          <div className="role-indicator-mobile" style={{ backgroundColor: '#9f7aea' }}>
            <span>👑</span>
            <span className="role-text">Fashion Administrator</span>
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
            <a href="/admin/fashion/add" className="nav-item">
              <span className="nav-icon">➕</span>
              <span>Add Fashion Items</span>
            </a>
            <a href="/admin/alerts" className="nav-item">
              <span className="nav-icon">🔔</span>
              <span>Stock Alerts</span>
              {alertCount > 0 && (
                <span className="alert-badge-nav">{alertCount}</span>
              )}
            </a>
            <a href="/admin/users" className="nav-item">
              <span className="nav-icon">👥</span>
              <span>User Management</span>
              {pendingUsers.length > 0 && (
                <span className="alert-badge-nav">{pendingUsers.length}</span>
              )}
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
              <h1>Fashion Admin Dashboard 👑</h1>
              <p className="topbar-subtitle">Manage your fashion retail business and inventory</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="notification-bell" onClick={() => navigate('/admin/alerts')}>
              🔔
              {alertCount > 0 && <span className="notification-count">{alertCount}</span>}
            </div>
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role" style={{ color: '#9f7aea' }}>
                👑 Fashion Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Pending Approvals Banner */}
        {pendingUsers.length > 0 && (
          <div className="alert-banner" style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b' }}>
            <div className="banner-icon">👥</div>
            <div className="banner-content">
              <h4>⚡ Manager Approvals Required!</h4>
              <p>You have {pendingUsers.length} manager{pendingUsers.length > 1 ? 's' : ''} waiting for approval. Review and approve access.</p>
            </div>
            <button className="banner-btn" onClick={() => navigate('/admin/users')}>Review Users →</button>
          </div>
        )}

        {/* Fashion Retail Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon blue">👥</div>
            <div className="stat-details">
              <h3>Total Users</h3>
              <p className="stat-number">{(dashboardData.stats?.users?.approved || 0) + (dashboardData.stats?.users?.pending || 0)}</p>
              <span className="stat-change positive">✓ {dashboardData.stats?.users?.approved || 0} approved</span>
            </div>
          </div>

          <div className="stat-card stat-card-clickable" onClick={() => navigate('/fashion')}>
            <div className="stat-icon green">👗</div>
            <div className="stat-details">
              <h3>Fashion Products</h3>
              <p className="stat-number">{fashionStats.totalProducts}</p>
              <span className="stat-change positive">✓ {fashionStats.totalVariants} variants</span>
            </div>
            <div className="card-hover-indicator">→</div>
          </div>

          <div className="stat-card stat-card-clickable" onClick={() => navigate('/admin/alerts')}>
            <div className="stat-icon orange">⚠️</div>
            <div className="stat-details">
              <h3>Stock Alerts</h3>
              <p className="stat-number">{fashionStats.lowStockProducts + fashionStats.outOfStockProducts}</p>
              <span className="stat-change negative">⚠ {fashionStats.outOfStockProducts} out of stock</span>
            </div>
            <div className="card-hover-indicator">→</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">🏷️</div>
            <div className="stat-details">
              <h3>Fashion Brands</h3>
              <p className="stat-number">{fashionStats.totalBrands}</p>
              <span className="stat-change positive">✓ {fashionStats.currentSeasonProducts} seasonal items</span>
            </div>
          </div>
        </div>

        {/* Pending User Approvals */}
        {pendingUsers.length > 0 && (
          <div className="recent-activity">
            <h2>👥 Pending Manager Approvals</h2>
            <div className="activity-list">
              {pendingUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="activity-item" style={{ padding: '15px', border: '1px solid #e2e8f0' }}>
                  <div className="activity-icon orange">👤</div>
                  <div className="activity-details" style={{ flex: 1 }}>
                    <p className="activity-text">
                      <strong>{user.username}</strong> ({user.email}) - Manager Registration
                    </p>
                    <span className="activity-time">🕐 {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="action-btn" 
                      style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 16px', fontSize: '14px' }}
                      onClick={() => handleApproveUser(user.id)}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="action-btn" 
                      style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', fontSize: '14px' }}
                      onClick={() => handleRejectUser(user.id)}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pendingUsers.length > 5 && (
              <button className="action-btn action-btn-info" onClick={() => navigate('/admin/users')}>
                View All {pendingUsers.length} Pending Users →
              </button>
            )}
          </div>
        )}

       {/* Fashion Products Management Section */}
<div className="recent-activity">
  <div className="section-header">
    <div className="section-title-group">
      <h2>👗 Fashion Collection</h2>
      <span className="product-count-badge">{fashionProducts?.length || 0} Products</span>
    </div>
    <div className="header-actions-group">
      <button 
        className="export-btn"
        onClick={() => openExportModal('products')}
        disabled={exporting}
      >
        <span className="btn-icon">📊</span>
        <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
      </button>
      <button 
        className="view-collection-btn"
        onClick={() => navigate('/fashion')}
      >
        <span className="btn-icon">👗</span>
        <span>View Collection</span>
      </button>
      <button 
        className="add-product-btn"
        onClick={() => navigate('/fashion/add-product')}
      >
        <span className="btn-icon">➕</span>
        <span>Add New Product</span>
      </button>
    </div>
  </div>
  
  <div className="table-container">
    <table className="products-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Season</th>
          <th>Variants</th>
          <th>Total Stock</th>
          <th>Status</th>
          <th>Base Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner-large"></div>
              <p>Loading fashion collection...</p>
            </td>
          </tr>
        ) : (fashionProducts || []).length === 0 ? (
          <tr>
            <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>👗</div>
              <p style={{ color: '#718096', fontSize: '16px' }}>No fashion products available. Start building your collection!</p>
            </td>
          </tr>
        ) : (
          (fashionProducts || []).slice(0, 10).map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-info">
                  <div className="product-name-with-icon">
                    <span className="product-icon">{getCategoryIcon(product.category)}</span>
                    <strong>{product.name}</strong>
                  </div>
                  {product.description && <div className="product-desc">{product.description}</div>}
                </div>
              </td>
              <td>
                <span className="category-badge fashion-category">
                  {product.categoryDisplayName}
                </span>
              </td>
              <td>
                <span className="brand-name">{product.brand}</span>
              </td>
              <td>
                <span className="season-badge">
                  {getSeasonEmoji(product.season)} {product.seasonDisplayName}
                </span>
              </td>
              <td>
                <span className="variants-count">
                  {product.variants?.length || 0} variants
                </span>
              </td>
              <td>
                <span className={`stock-quantity ${
                  product.totalStock === 0 ? 'out-of-stock' : 
                  product.lowStock ? 'low-stock' : 'in-stock'
                }`}>
                  {product.totalStock || 0}
                </span>
              </td>
              <td>
                <span className={`status-badge ${
                  product.outOfStock ? 'status-out' : 
                  product.lowStock ? 'status-low' : 'status-good'
                }`}>
                  {product.outOfStock ? 'Out of Stock' : 
                   product.lowStock ? 'Low Stock' : 'In Stock'}
                </span>
              </td>
              <td>₹{product.basePrice?.toLocaleString('en-IN')}</td>
              <td>
                <div className="stock-actions">
                  <button 
                    className="stock-btn stock-view"
                    onClick={() => navigate(`/fashion/product/${product.id}`)}
                    title="View Product Details"
                  >
                    👁️
                  </button>
                  <button 
                    className="stock-btn stock-edit"
                    onClick={() => navigate('/fashion')}
                    title="Manage Product"
                  >
                    ✏️
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  
  {fashionProducts.length > 10 && (
    <div className="table-footer">
      <button 
        className="view-all-btn"
        onClick={() => navigate('/fashion')}
      >
        View All {fashionProducts.length} Fashion Products →
      </button>
    </div>
  )}
</div>


        {/* Fashion Business Overview */}
        <div className="recent-activity">
          <h2>🏪 Fashion Business Overview</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon blue">👥</div>
              <div className="activity-details">
                <p className="activity-text">
                  User Management: {dashboardData.stats?.users?.approved || 0} approved, {dashboardData.stats?.users?.pending || 0} pending, {dashboardData.stats?.users?.rejected || 0} rejected
                </p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon green">👗</div>
              <div className="activity-details">
                <p className="activity-text">
                  Fashion Collection: {fashionStats.totalProducts} products across {fashionStats.totalBrands} brands with {fashionStats.totalVariants} size/color variants
                </p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon orange">⚠️</div>
              <div className="activity-details">
                <p className="activity-text">
                  Stock Alerts: {fashionStats.lowStockProducts} low stock items, {fashionStats.outOfStockProducts} out of stock items
                </p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon purple">🌸</div>
              <div className="activity-details">
                <p className="activity-text">
                  Seasonal Collection: {fashionStats.currentSeasonProducts} items available for current season ({getCurrentSeason()})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="modal-overlay">
            <div className="export-modal">
              <div className="modal-header">
                <h3>📊 Export {exportType === 'products' ? 'Fashion Products' : 'Transactions'}</h3>
                <button className="close-modal" onClick={() => setShowExportModal(false)}>✕</button>
              </div>
              
              <div className="modal-content">
                {exportType === 'transactions' && (
                  <div className="date-range-section">
                    <h4>📅 Select Date Range (Optional)</h4>
                    <div className="date-inputs">
                      <div className="date-input-group">
                        <label>Start Date:</label>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        />
                      </div>
                      <div className="date-input-group">
                        <label>End Date:</label>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        />
                      </div>
                    </div>
                    <p className="date-help">Leave empty to export all records</p>
                  </div>
                )}
                
                <div className="export-info">
                  <p>
                    {exportType === 'products' 
                      ? `📋 This will export all ${fashionStats.totalProducts} fashion products with their details, variants, and stock information.`
                      : '📋 This will export transaction history with dates, products, and stock changes.'
                    }
                  </p>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowExportModal(false)}
                  disabled={exporting}
                >
                  Cancel
                </button>
                <button 
                  className="export-btn" 
                  onClick={exportType === 'products' ? handleExportFashionProducts : handleExportTransactions}
                  disabled={exporting}
                >
                  {exporting ? '⏳ Exporting...' : '📊 Export CSV'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;