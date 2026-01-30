import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import '../Dashboard/Dashboard.css';
import './FashionStockManagement.css';

function FashionStockManagement() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  const username = localStorage.getItem('username') || 'Admin';
  const [fashionProducts, setFashionProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState('STOCK_IN');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockReason, setStockReason] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  useEffect(() => {
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      navigate('/dashboard');
      return;
    }
    loadFashionProducts();
  }, [userRole, navigate]);

  const loadFashionProducts = async () => {
    try {
      console.log('🔄 Loading fashion products for stock management...');
      const response = await axiosInstance.get('/fashion-products');
      console.log('👗 Fashion products loaded:', response.data.length);
      setFashionProducts(response.data || []);
    } catch (error) {
      console.error('❌ Error loading fashion products:', error);
      setFashionProducts([]);
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
      default: return 'Fashion User';
    }
  };

  const getRoleEmoji = () => {
    switch(userRole) {
      case 'ADMIN': return '👑';
      case 'MANAGER': return '👔';
      default: return '👤';
    }
  };

  const getRoleColor = () => {
    switch(userRole) {
      case 'ADMIN': return '#9f7aea';
      case 'MANAGER': return '#ed8936';
      default: return '#4a5568';
    }
  };

  const openStockModal = (product, variant) => {
    setSelectedProduct(product);
    setSelectedVariant(variant);
    setShowStockModal(true);
    setStockQuantity('');
    setStockReason('');
    setStockAction('STOCK_IN');
  };

  const handleStockUpdate = async () => {
    if (!selectedProduct || !selectedVariant || !stockQuantity || stockQuantity <= 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    try {
      console.log('📦 Updating stock for:', selectedProduct.name, selectedVariant.sizeDisplayName + '/' + selectedVariant.colorDisplayName);
      
      const stockRequest = {
        type: stockAction,
        quantity: parseInt(stockQuantity),
        reason: stockReason || `${stockAction === 'STOCK_IN' ? 'Stock replenishment' : 'Stock adjustment'} by ${username}`
      };

      const response = await axiosInstance.post(
        `/fashion-products/${selectedProduct.id}/variants/${selectedVariant.id}/stock`,
        stockRequest
      );

      console.log('✅ Stock updated successfully:', response.data);
      
      // Refresh the products list
      await loadFashionProducts();
      
      // Close modal
      setShowStockModal(false);
      
      alert(`✅ Stock ${stockAction === 'STOCK_IN' ? 'added' : 'removed'} successfully!\n\nProduct: ${selectedProduct.name}\nVariant: ${selectedVariant.sizeDisplayName}/${selectedVariant.colorDisplayName}\nQuantity: ${stockQuantity}`);
      
    } catch (error) {
      console.error('❌ Error updating stock:', error);
      alert(`❌ Failed to update stock: ${error.response?.data?.message || error.message}`);
    }
  };

  const getStockStatus = (variant) => {
    if (variant.quantity === 0) return { status: 'Out of Stock', class: 'out-of-stock', color: '#e53e3e' };
    if (variant.quantity <= variant.minStockLevel) return { status: 'Low Stock', class: 'low-stock', color: '#dd6b20' };
    return { status: 'In Stock', class: 'in-stock', color: '#38a169' };
  };

  const filteredProducts = fashionProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'CLOTHING_MENS', 'CLOTHING_WOMENS', 'CLOTHING_KIDS', 'FOOTWEAR_MENS', 'FOOTWEAR_WOMENS', 'FOOTWEAR_KIDS', 'ACCESSORIES_BAGS', 'ACCESSORIES_JEWELRY'];

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
            <a href="/fashion/add-product" className="nav-item">
              <span className="nav-icon">➕</span>
              <span>Add Fashion Items</span>
            </a>
            <a href="/admin/fashion-stock" className="nav-item active">
              <span className="nav-icon">📦</span>
              <span>Stock Management</span>
            </a>
            <a href="/admin/alerts" className="nav-item">
              <span className="nav-icon">🔔</span>
              <span>Stock Alerts</span>
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
              <h1>📦 Fashion Stock Management</h1>
              <p className="topbar-subtitle">Manage inventory levels for all fashion product variants</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role" style={{ color: getRoleColor() }}>
                {getRoleEmoji()} {getRoleDisplayName()}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="stock-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'ALL' ? 'All Categories' : category.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products List */}
        <div className="stock-management-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading fashion products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👗</div>
              <h3>No Products Found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="products-stock-list">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-stock-card">
                  <div className="product-header">
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-brand">by {product.brand}</p>
                      <span className="product-category">{product.categoryDisplayName}</span>
                    </div>
                    <div className="product-summary">
                      <div className="total-stock">
                        <span className="stock-label">Total Stock:</span>
                        <span className="stock-value">{product.totalStock || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="variants-grid">
                    {product.variants && product.variants.length > 0 ? (
                      product.variants.map(variant => {
                        const stockStatus = getStockStatus(variant);
                        return (
                          <div key={variant.id} className="variant-stock-item">
                            <div className="variant-info">
                              <div className="variant-details">
                                <span className="size-badge">{variant.sizeDisplayName}</span>
                                <span className="color-badge">{variant.colorDisplayName}</span>
                              </div>
                              <div className="stock-info">
                                <span className="current-stock">{variant.quantity} units</span>
                                <span 
                                  className={`stock-status ${stockStatus.class}`}
                                  style={{ color: stockStatus.color }}
                                >
                                  {stockStatus.status}
                                </span>
                              </div>
                              <div className="min-stock-info">
                                <span className="min-stock-label">Min: {variant.minStockLevel}</span>
                              </div>
                            </div>
                            <div className="variant-actions">
                              <button 
                                className="stock-in-btn"
                                onClick={() => {
                                  setStockAction('STOCK_IN');
                                  openStockModal(product, variant);
                                }}
                              >
                                📦 Stock In
                              </button>
                              <button 
                                className="stock-out-btn"
                                onClick={() => {
                                  setStockAction('STOCK_OUT');
                                  openStockModal(product, variant);
                                }}
                                disabled={variant.quantity === 0}
                              >
                                📤 Stock Out
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-variants">
                        <p>No variants available for this product</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && selectedVariant && (
        <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {stockAction === 'STOCK_IN' ? '📦 Add Stock' : '📤 Remove Stock'}
              </h2>
              <button onClick={() => setShowStockModal(false)} className="close-modal">✕</button>
            </div>

            <div className="modal-body">
              <div className="product-details">
                <h3>{selectedProduct.name}</h3>
                <p>Brand: {selectedProduct.brand}</p>
                <p>Variant: {selectedVariant.sizeDisplayName} / {selectedVariant.colorDisplayName}</p>
                <p>Current Stock: <strong>{selectedVariant.quantity} units</strong></p>
                <p>Minimum Level: {selectedVariant.minStockLevel} units</p>
              </div>

              <div className="stock-form">
                <div className="form-group">
                  <label>Action Type</label>
                  <select 
                    value={stockAction} 
                    onChange={(e) => setStockAction(e.target.value)}
                  >
                    <option value="STOCK_IN">📦 Stock In (Add)</option>
                    <option value="STOCK_OUT">📤 Stock Out (Remove)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    max={stockAction === 'STOCK_OUT' ? selectedVariant.quantity : 9999}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <textarea
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                    placeholder={`Enter reason for ${stockAction === 'STOCK_IN' ? 'adding' : 'removing'} stock...`}
                    rows="3"
                  />
                </div>

                {stockAction === 'STOCK_OUT' && parseInt(stockQuantity) > selectedVariant.quantity && (
                  <div className="warning-message">
                    ⚠️ Cannot remove more stock than available ({selectedVariant.quantity} units)
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowStockModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button 
                onClick={handleStockUpdate}
                disabled={!stockQuantity || stockQuantity <= 0 || (stockAction === 'STOCK_OUT' && parseInt(stockQuantity) > selectedVariant.quantity)}
                className="confirm-btn"
              >
                {stockAction === 'STOCK_IN' ? '📦 Add Stock' : '📤 Remove Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FashionStockManagement;