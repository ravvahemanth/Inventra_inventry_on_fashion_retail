import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import './FashionProductDetail.css';
import '../Dashboard/Dashboard.css';

function FashionProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = getUserRole();
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const username = localStorage.getItem('username') || 'User';
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState('STOCK_IN');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockReason, setStockReason] = useState('');

  useEffect(() => {
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    try {
      console.log('🔄 Loading fashion product detail for ID:', id);
      const response = await axiosInstance.get(`/fashion-products/${id}`);
      console.log('👗 Product detail loaded:', response.data);
      setProduct(response.data);
      if (response.data.variants && response.data.variants.length > 0) {
        setSelectedVariant(response.data.variants[0]);
      }
    } catch (error) {
      console.error('❌ Error loading product detail:', error);
      if (error.response?.status === 404) {
        navigate('/fashion');
      }
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

  const getStockStatus = (variant) => {
    if (variant.quantity === 0) return { status: 'Out of Stock', class: 'out-of-stock', color: '#e53e3e' };
    if (variant.quantity <= variant.minStockLevel) return { status: 'Low Stock', class: 'low-stock', color: '#dd6b20' };
    return { status: 'In Stock', class: 'in-stock', color: '#38a169' };
  };

  const openStockModal = (variant, action) => {
    setSelectedVariant(variant);
    setStockAction(action);
    setShowStockModal(true);
    setStockQuantity('');
    setStockReason('');
  };

  const handleStockUpdate = async () => {
    if (!selectedVariant || !stockQuantity || stockQuantity <= 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    try {
      console.log('📦 Updating stock for:', product.name, selectedVariant.sizeDisplayName + '/' + selectedVariant.colorDisplayName);
      
      const stockRequest = {
        type: stockAction,
        quantity: parseInt(stockQuantity),
        reason: stockReason || `${stockAction === 'STOCK_IN' ? 'Stock replenishment' : 'Stock adjustment'} by ${username}`
      };

      const response = await axiosInstance.post(
        `/fashion-products/${product.id}/variants/${selectedVariant.id}/stock`,
        stockRequest
      );

      console.log('✅ Stock updated successfully:', response.data);
      
      // Refresh the product details
      await loadProductDetail();
      
      // Close modal
      setShowStockModal(false);
      
      alert(`✅ Stock ${stockAction === 'STOCK_IN' ? 'added' : 'removed'} successfully!\n\nProduct: ${product.name}\nVariant: ${selectedVariant.sizeDisplayName}/${selectedVariant.colorDisplayName}\nQuantity: ${stockQuantity}`);
      
    } catch (error) {
      console.error('❌ Error updating stock:', error);
      alert(`❌ Failed to update stock: ${error.response?.data?.message || error.message}`);
    }
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

  const getGenderEmoji = (gender) => {
    const genderEmojis = {
      'MALE': '👨',
      'FEMALE': '👩',
      'UNISEX': '👫',
      'KIDS': '👶'
    };
    return genderEmojis[gender] || '👫';
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      // Men's Clothing
      'CLOTHING_MENS': '👔',
      
      // Women's Clothing  
      'CLOTHING_WOMENS': '👗',
      
      // Kids' Clothing
      'CLOTHING_KIDS': '👶',
      
      // Men's Footwear
      'FOOTWEAR_MENS': '👞',
      
      // Women's Footwear
      'FOOTWEAR_WOMENS': '👠',
      
      // Kids' Footwear
      'FOOTWEAR_KIDS': '👟',
      
      // Accessories
      'ACCESSORIES_BAGS': '👜',
      'ACCESSORIES_JEWELRY': '💍',
      'ACCESSORIES_WATCHES': '⌚',
      'ACCESSORIES_BELTS': '🔗',
      'ACCESSORIES_HATS': '🎩',
      'ACCESSORIES_SUNGLASSES': '🕶️'
    };
    
    return categoryIcons[category] || '👗';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="main-content">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="dashboard-container">
        <div className="main-content">
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3>Product Not Found</h3>
            <p>The requested fashion product could not be found.</p>
            <button onClick={() => navigate('/fashion')} className="back-btn">
              ← Back to Fashion Collection
            </button>
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
            <button className="back-btn" onClick={() => navigate('/fashion')}>
              ← Back to Fashion Collection
            </button>
            <div className="page-title-dash">
              <h1>{getCategoryIcon(product.category)} {product.name}</h1>
              <p className="topbar-subtitle">Fashion product details and variant management</p>
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

        {/* Product Detail Content */}
        <div className="product-detail-content">
          {/* Product Header */}
          <div className="product-detail-header">
            <div className="product-image-section">
              <div className="product-image-placeholder">
                <span className="product-category-icon-large">
                  {getCategoryIcon(product.category)}
                </span>
              </div>
            </div>

            <div className="product-info-section">
              <div className="product-badges">
                <span className="season-badge">
                  {getSeasonEmoji(product.season)} {product.seasonDisplayName}
                </span>
                <span className="gender-badge">
                  {getGenderEmoji(product.targetGender)} {product.genderDisplayName}
                </span>
                <span className="category-badge">
                  {product.categoryDisplayName}
                </span>
              </div>

              <h1 className="product-title">{product.name}</h1>
              <p className="product-brand">by {product.brand}</p>
              <p className="product-description">{product.description}</p>

              <div className="product-details-grid">
                <div className="detail-item">
                  <span className="detail-label">SKU:</span>
                  <span className="detail-value">{product.sku}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Base Price:</span>
                  <span className="detail-value">₹{product.basePrice}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Material:</span>
                  <span className="detail-value">{product.material || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Care Instructions:</span>
                  <span className="detail-value">{product.careInstructions || 'Standard care'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Stock:</span>
                  <span className="detail-value">{product.totalStock || 0} units</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Available Variants:</span>
                  <span className="detail-value">{product.variants?.length || 0} variants</span>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="variants-section">
            <h2>Available Variants</h2>
            {product.variants && product.variants.length > 0 ? (
              <div className="variants-grid">
                {product.variants.map(variant => {
                  const stockStatus = getStockStatus(variant);
                  return (
                    <div key={variant.id} className="variant-detail-card">
                      <div className="variant-header">
                        <div className="variant-info">
                          <span className="size-badge-large">{variant.sizeDisplayName}</span>
                          <span className="color-badge-large">{variant.colorDisplayName}</span>
                        </div>
                        <div className="variant-price">
                          ₹{(parseFloat(product.basePrice) + parseFloat(variant.priceAdjustment || 0)).toFixed(2)}
                        </div>
                      </div>

                      <div className="variant-stock-info">
                        <div className="stock-display">
                          <span className="stock-label">Current Stock:</span>
                          <span className="stock-value">{variant.quantity} units</span>
                        </div>
                        <div className="stock-status-display">
                          <span 
                            className={`stock-status ${stockStatus.class}`}
                            style={{ color: stockStatus.color }}
                          >
                            {stockStatus.status}
                          </span>
                        </div>
                        <div className="min-stock-display">
                          <span className="min-stock-label">Min Level: {variant.minStockLevel}</span>
                        </div>
                      </div>

                      {variant.variantSku && (
                        <div className="variant-sku">
                          <span className="sku-label">SKU:</span>
                          <span className="sku-value">{variant.variantSku}</span>
                        </div>
                      )}

                      {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                        <div className="variant-actions">
                          <button 
                            className="stock-in-btn"
                            onClick={() => openStockModal(variant, 'STOCK_IN')}
                          >
                            📦 Stock In
                          </button>
                          <button 
                            className="stock-out-btn"
                            onClick={() => openStockModal(variant, 'STOCK_OUT')}
                            disabled={variant.quantity === 0}
                          >
                            📤 Stock Out
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-variants">
                <p>No variants available for this product</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stock Update Modal */}
      {showStockModal && selectedVariant && (
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
                <h3>{product.name}</h3>
                <p>Brand: {product.brand}</p>
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

export default FashionProductDetail;