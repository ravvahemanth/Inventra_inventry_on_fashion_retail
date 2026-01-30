import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import './FashionProducts.css';
import '../Dashboard/Dashboard.css';

function FashionProducts() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const username = localStorage.getItem('username') || 'User';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSeason, setSelectedSeason] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Fashion categories
  const categories = [
    'ALL', 'CLOTHING_MENS', 'CLOTHING_WOMENS', 'CLOTHING_KIDS',
    'FOOTWEAR_MENS', 'FOOTWEAR_WOMENS', 'FOOTWEAR_KIDS',
    'ACCESSORIES_BAGS', 'ACCESSORIES_JEWELRY', 'ACCESSORIES_WATCHES',
    'ACCESSORIES_BELTS', 'ACCESSORIES_HATS', 'ACCESSORIES_SUNGLASSES'
  ];

  const seasons = ['ALL', 'SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'ALL_SEASON'];
  const genders = ['ALL', 'MALE', 'FEMALE', 'UNISEX', 'KIDS'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('🔄 Loading fashion products...');
      const response = await axiosInstance.get('/fashion-products');
      console.log('👗 Fashion products response:', response.data);
      setProducts(response.data || []);
    } catch (error) {
      console.error('❌ Error loading fashion products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadProducts();
      return;
    }

    try {
      const response = await axiosInstance.get(`/fashion-products/search?q=${encodeURIComponent(searchTerm)}`);
      setProducts(response.data || []);
    } catch (error) {
      console.error('❌ Error searching products:', error);
      setProducts([]);
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    if (category === 'ALL') {
      loadProducts();
      return;
    }

    try {
      const response = await axiosInstance.get(`/fashion-products/category/${category}`);
      setProducts(response.data || []);
    } catch (error) {
      console.error('❌ Error filtering by category:', error);
      setProducts([]);
    }
  };

  const handleSeasonFilter = async (season) => {
    setSelectedSeason(season);
    if (season === 'ALL') {
      loadProducts();
      return;
    }

    try {
      const response = await axiosInstance.get(`/fashion-products/season/${season}`);
      setProducts(response.data || []);
    } catch (error) {
      console.error('❌ Error filtering by season:', error);
      setProducts([]);
    }
  };

  const handleGenderFilter = async (gender) => {
    setSelectedGender(gender);
    if (gender === 'ALL') {
      loadProducts();
      return;
    }

    try {
      const response = await axiosInstance.get(`/fashion-products/gender/${gender}`);
      setProducts(response.data || []);
    } catch (error) {
      console.error('❌ Error filtering by gender:', error);
      setProducts([]);
    }
  };

  const handlePriceFilter = async () => {
    if (!priceRange.min || !priceRange.max) {
      loadProducts();
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/fashion-products/price-range?min=${priceRange.min}&max=${priceRange.max}`
      );
      setProducts(response.data || []);
    } catch (error) {
      console.error('❌ Error filtering by price:', error);
      setProducts([]);
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

  const clearFilters = () => {
    setSelectedCategory('ALL');
    setSelectedSeason('ALL');
    setSelectedGender('ALL');
    setSelectedBrand('ALL');
    setPriceRange({ min: '', max: '' });
    setSearchTerm('');
    loadProducts();
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'CLOTHING_MENS': "Men's Clothing",
      'CLOTHING_WOMENS': "Women's Clothing",
      'CLOTHING_KIDS': "Kids' Clothing",
      'FOOTWEAR_MENS': "Men's Footwear",
      'FOOTWEAR_WOMENS': "Women's Footwear",
      'FOOTWEAR_KIDS': "Kids' Footwear",
      'ACCESSORIES_BAGS': 'Bags & Purses',
      'ACCESSORIES_JEWELRY': 'Jewelry',
      'ACCESSORIES_WATCHES': 'Watches',
      'ACCESSORIES_BELTS': 'Belts',
      'ACCESSORIES_HATS': 'Hats & Caps',
      'ACCESSORIES_SUNGLASSES': 'Sunglasses'
    };
    return categoryMap[category] || category;
  };

  const getStockStatus = (product) => {
    if (product.outOfStock) return { status: 'Out of Stock', class: 'out-of-stock' };
    if (product.lowStock) return { status: 'Low Stock', class: 'low-stock' };
    return { status: 'In Stock', class: 'in-stock' };
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="main-content">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading fashion collection...</p>
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
            <a href="/fashion" className="nav-item active">
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
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
            <div className="page-title-dash">
              <h1>👗 Fashion Collection</h1>
              <p className="topbar-subtitle">Discover the latest trends in apparel, footwear, and accessories</p>
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

        {/* Header Actions */}
        <div className="fashion-header-actions">
          <div className="header-actions">
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              🔍 {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
              <button 
                className="add-product-btn"
                onClick={() => navigate('/fashion/add-product')}
              >
                ➕ Add New Product
              </button>
            )}
          </div>
        </div>

      {/* Filters */}
      {showFilters && (
        <div className="fashion-filters">
          <div className="filter-row">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>🔍</button>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => handleCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'ALL' ? 'All Categories' : getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Season</label>
              <select 
                value={selectedSeason} 
                onChange={(e) => handleSeasonFilter(e.target.value)}
              >
                {seasons.map(season => (
                  <option key={season} value={season}>
                    {season === 'ALL' ? 'All Seasons' : season.charAt(0) + season.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Gender</label>
              <select 
                value={selectedGender} 
                onChange={(e) => handleGenderFilter(e.target.value)}
              >
                {genders.map(gender => (
                  <option key={gender} value={gender}>
                    {gender === 'ALL' ? 'All Genders' : gender.charAt(0) + gender.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="price-filter">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
                <button onClick={handlePriceFilter}>Apply</button>
              </div>
            </div>

            <button className="clear-filters-btn" onClick={clearFilters}>
              🗑️ Clear All
            </button>
          </div>
        </div>
      )}

        {/* Products Grid */}
        <div className="fashion-products-grid">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👗</div>
              <h3>No Products Found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            products.map(product => {
              const stockStatus = getStockStatus(product);
              return (
                <div key={product.id} className="fashion-product-card">
                  <div className="product-image-placeholder">
                    <span className="product-category-icon">
                      {getCategoryIcon(product.category)}
                    </span>
                  </div>
                  
                  <div className="product-info">
                    <div className="product-header">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-badges">
                        <span className="season-badge">
                          {getSeasonEmoji(product.season)} {product.seasonDisplayName}
                        </span>
                        <span className="gender-badge">
                          {getGenderEmoji(product.targetGender)} {product.genderDisplayName}
                        </span>
                      </div>
                    </div>
                    
                    <p className="product-brand">by {product.brand}</p>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-details">
                      <div className="product-category">
                        <span className="label">Category:</span>
                        <span className="value">{product.categoryDisplayName}</span>
                      </div>
                      
                      {product.material && (
                        <div className="product-material">
                          <span className="label">Material:</span>
                          <span className="value">{product.material}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="product-variants">
                      <div className="variants-summary">
                        <span>Available in {product.variants?.length || 0} variants</span>
                      </div>
                      <div className="variants-preview">
                        {product.variants?.slice(0, 3).map((variant, index) => (
                          <span key={index} className="variant-tag">
                            {variant.sizeDisplayName}/{variant.colorDisplayName}
                          </span>
                        ))}
                        {product.variants?.length > 3 && (
                          <span className="more-variants">+{product.variants.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="product-footer">
                      <div className="product-price">
                        <span className="price-label">Starting from</span>
                        <span className="price-value">₹{product.basePrice}</span>
                      </div>
                      
                      <div className="product-stock">
                        <span className={`stock-status ${stockStatus.class}`}>
                          {stockStatus.status}
                        </span>
                        <span className="stock-quantity">
                          {product.totalStock} units total
                        </span>
                      </div>
                    </div>
                    
                    <div className="product-actions">
                      <button 
                        className="view-details-btn"
                        onClick={() => navigate(`/fashion/product/${product.id}`)}
                      >
                        👁️ View Details
                      </button>
                      {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                        <button 
                          className="manage-stock-btn"
                          onClick={() => navigate('/admin/fashion-stock')}
                        >
                          📦 Manage Stock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default FashionProducts;