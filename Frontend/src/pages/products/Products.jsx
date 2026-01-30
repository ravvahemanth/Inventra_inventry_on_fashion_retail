import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  stockIn,
  stockOut
} from '../../services/productService';
import { getUserRole, isManager } from '../../services/authService';
import './Products.css';


function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showSidebar, setShowSidebar] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitPrice: '',
    stockQuantity: '',
    minStockLevel: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const userRole = getUserRole();
  const canModify = isManager();

  const categories = ['Electronics', 'Office Supplies', 'Furniture', 'Stationery'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterCategory, filterStatus]);

  const loadProducts = async () => {
    try {
      const response = await getAllProducts();
      const productsData = response.data?.products || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      console.log('✅ Products loaded:', productsData);
    } catch (error) {
      console.error('❌ Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'ALL') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(p => {
        const quantity = p.quantity || 0;
        const minLevel = p.minStockLevel || 0;
        
        if (filterStatus === 'IN_STOCK') {
          return quantity > minLevel;
        } else if (filterStatus === 'LOW_STOCK') {
          return quantity > 0 && quantity <= minLevel;
        } else if (filterStatus === 'OUT_OF_STOCK') {
          return quantity === 0;
        }
        return true;
      });
    }

    setFilteredProducts(filtered);
  };

  const getStockStatus = (product) => {
    const quantity = product?.quantity || 0;
    const minLevel = product?.minStockLevel || 0;
    
    if (quantity === 0) {
      return { label: 'OUT OF STOCK', class: 'status-out', icon: '🔴' };
    } else if (quantity <= minLevel) {
      return { label: 'LOW STOCK', class: 'status-low', icon: '⚠️' };
    } else {
      return { label: 'IN STOCK', class: 'status-in', icon: '✓' };
    }
  };

  const openModal = (type, product = null) => {
    if (!canModify && type !== 'view') {
      alert('You do not have permission to perform this action');
      return;
    }

    setModalType(type);
    setSelectedProduct(product);
    
    if (type === 'add') {
      setFormData({
        name: '',
        sku: '',
        category: categories[0],
        unitPrice: '',
        stockQuantity: '',
        minStockLevel: ''
      });
    } else if (type === 'edit' && product) {
      setFormData({
        name: product?.name || '',
        sku: product?.sku || '',
        category: product?.category || categories[0],
        unitPrice: product?.price || '',
        stockQuantity: product?.quantity || '',
        minStockLevel: product?.minStockLevel || ''
      });
    } else if (type === 'view' && product) {
      setFormData({
        name: product?.name || '',
        sku: product?.sku || '',
        category: product?.category || '',
        unitPrice: product?.price || '',
        stockQuantity: product?.quantity || '',
        minStockLevel: product?.minStockLevel || ''
      });
    }
    
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU code is required';
    } else {
      const isDuplicate = products.some(p => 
        p.sku === formData.sku && 
        (!selectedProduct || p.id !== selectedProduct.id)
      );
      if (isDuplicate) {
        newErrors.sku = 'SKU code already exists. Please use a unique SKU.';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.unitPrice) {
      newErrors.unitPrice = 'Unit price is required';
    } else if (parseFloat(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Unit price must be a positive number';
    }

    if (formData.stockQuantity === '') {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else if (parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
    }

    if (formData.minStockLevel === '') {
      newErrors.minStockLevel = 'Minimum stock level is required';
    } else if (parseInt(formData.minStockLevel) < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const productData = {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        stockQuantity: parseInt(formData.stockQuantity),
        minStockLevel: parseInt(formData.minStockLevel)
      };

      if (modalType === 'add') {
        await addProduct(productData);
      } else if (modalType === 'edit') {
        await updateProduct(selectedProduct.id, productData);
      }

      await loadProducts();
      closeModal();
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.message || 'Operation failed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!canModify) {
      alert('You do not have permission to delete products');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${product?.name}"?`)) {
      try {
        await deleteProduct(product.id);
        await loadProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleStockOperation = async (product, operation) => {
    if (!canModify) {
      alert('You do not have permission to modify stock');
      return;
    }

    const quantity = prompt(
      `Enter quantity to ${operation === 'in' ? 'add' : 'remove'}:`,
      '1'
    );

    if (quantity === null) return;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    if (operation === 'out' && qty > (product?.quantity || 0)) {
      alert(`Cannot remove ${qty} units. Only ${product?.quantity || 0} units available.`);
      return;
    }

    try {
      if (operation === 'in') {
        await stockIn(product.id, qty);
      } else {
        await stockOut(product.id, qty);
      }
      await loadProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Stock operation failed');
    }
  };

  const stats = {
    total: Array.isArray(products) ? products.length : 0,
    inStock: Array.isArray(products) ? products.filter(p => {
      const qty = p?.quantity || 0;
      const min = p?.minStockLevel || 0;
      return qty > min;
    }).length : 0,
    lowStock: Array.isArray(products) ? products.filter(p => {
      const qty = p?.quantity || 0;
      const min = p?.minStockLevel || 0;
      return qty > 0 && qty <= min;
    }).length : 0,
    outOfStock: Array.isArray(products) ? products.filter(p => (p?.quantity || 0) === 0).length : 0
  };

  return (
    <div className="products-container">
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

          <nav className="sidebar-nav">
            <a href="/dashboard" className="nav-item">
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/products" className="nav-item active">
              <span className="nav-icon">📦</span>
              <span>Products</span>
            </a>
            <a href="/alerts" className="nav-item">
              <span className="nav-icon">🔔</span>
              <span>Alerts</span>
            </a>
            <a href="/transactions" className="nav-item">
              <span className="nav-icon">📝</span>
              <span>Transactions</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Top Bar */}
      <div className="products-topbar">
        <div className="topbar-left">
          <button className="menu-btn" onClick={() => setShowSidebar(true)}>
            ☰
          </button>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <div className="page-title">
            <h1>Product Inventory 📦</h1>
            <p className="page-subtitle">Manage your product catalog</p>
          </div>
        </div>
        
        {canModify && (
          <button className="btn-add-product" onClick={() => openModal('add')}>
            <span>➕</span>
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="products-stats">
        <div className="stat-card stat-card-hover" onClick={() => setFilterStatus('ALL')}>
          <div className="stat-icon blue">📦</div>
          <div className="stat-details">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.total}</p>
            <span className="stat-label">All inventory items</span>
          </div>
        </div>

        <div className="stat-card stat-card-hover" onClick={() => setFilterStatus('IN_STOCK')}>
          <div className="stat-icon green">✓</div>
          <div className="stat-details">
            <h3>In Stock</h3>
            <p className="stat-number">{stats.inStock}</p>
            <span className="stat-label">Above threshold</span>
          </div>
        </div>

        <div className="stat-card stat-card-hover" onClick={() => setFilterStatus('LOW_STOCK')}>
          <div className="stat-icon orange">⚠️</div>
          <div className="stat-details">
            <h3>Low Stock</h3>
            <p className="stat-number">{stats.lowStock}</p>
            <span className="stat-label">Needs restocking</span>
          </div>
        </div>

        <div className="stat-card stat-card-hover" onClick={() => setFilterStatus('OUT_OF_STOCK')}>
          <div className="stat-icon red">🔴</div>
          <div className="stat-details">
            <h3>Out of Stock</h3>
            <p className="stat-number">{stats.outOfStock}</p>
            <span className="stat-label">Immediate action</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="products-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="ALL">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Stock Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Products Found</h3>
          <p>
            {searchTerm || filterCategory !== 'ALL' || filterStatus !== 'ALL'
              ? 'Try adjusting your filters'
              : 'Start by adding your first product'}
          </p>
          {canModify && !searchTerm && filterCategory === 'ALL' && filterStatus === 'ALL' && (
            <button className="btn-empty-add" onClick={() => openModal('add')}>
              ➕ Add First Product
            </button>
          )}
        </div>
      ) : (
        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Min Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const status = getStockStatus(product);
                return (
                  <tr key={product?.id} className="product-row">
                    <td>
                      <div className="product-info">
                        <div className="product-icon">📦</div>
                        <div className="product-details">
                          <span className="product-name">{product?.name || 'N/A'}</span>
                          <span className="product-id">ID: {product?.id || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="sku-badge">{product?.sku || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="category-badge">{product?.category || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="price-text">
                        ₹{product?.price ? parseFloat(product.price).toLocaleString('en-IN') : '0.00'}
                      </span>
                    </td>
                    <td>
                      <span className="stock-quantity">{product?.quantity || 0}</span>
                    </td>
                    <td>
                      <span className="min-level">{product?.minStockLevel || 0}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${status.class}`}>
                        <span>{status.icon}</span>
                        <span>{status.label}</span>
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-view"
                          onClick={() => openModal('view', product)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        {canModify && (
                          <>
                            <button
                              className="btn-action btn-edit"
                              onClick={() => openModal('edit', product)}
                              title="Edit Product"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-action btn-stock-in"
                              onClick={() => handleStockOperation(product, 'in')}
                              title="Stock In"
                            >
                              ⬆️
                            </button>
                            <button
                              className="btn-action btn-stock-out"
                              onClick={() => handleStockOperation(product, 'out')}
                              title="Stock Out"
                              disabled={(product?.quantity || 0) === 0}
                            >
                              ⬇️
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleDelete(product)}
                              title="Delete Product"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'add' && '➕ Add New Product'}
                {modalType === 'edit' && '✏️ Edit Product'}
                {modalType === 'view' && '👁️ Product Details'}
              </h2>
              <button className="btn-close-modal" onClick={closeModal}>✕</button>
            </div>

            {errors.submit && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                <span>{errors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <span className="label-icon">📝</span>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    placeholder="Enter product name"
                    disabled={modalType === 'view'}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="sku">
                    <span className="label-icon">🏷️</span>
                    SKU Code * (Unique)
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className={`form-input ${errors.sku ? 'input-error' : ''}`}
                    placeholder="e.g., LAP-HP-001"
                    disabled={modalType === 'view' || modalType === 'edit'}
                  />
                  {errors.sku && <span className="error-text">{errors.sku}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">
                    <span className="label-icon">📂</span>
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`form-input ${errors.category ? 'input-error' : ''}`}
                    disabled={modalType === 'view'}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="unitPrice">
                    <span className="label-icon">💰</span>
                    Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="unitPrice"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    className={`form-input ${errors.unitPrice ? 'input-error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={modalType === 'view'}
                  />
                  {errors.unitPrice && <span className="error-text">{errors.unitPrice}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stockQuantity">
                    <span className="label-icon">📊</span>
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    className={`form-input ${errors.stockQuantity ? 'input-error' : ''}`}
                    placeholder="0"
                    min="0"
                    disabled={modalType === 'view'}
                  />
                  {errors.stockQuantity && <span className="error-text">{errors.stockQuantity}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="minStockLevel">
                    <span className="label-icon">⚠️</span>
                    Min Stock Level * (Alert Threshold)
                  </label>
                  <input
                    type="number"
                    id="minStockLevel"
                    name="minStockLevel"
                    value={formData.minStockLevel}
                    onChange={handleInputChange}
                    className={`form-input ${errors.minStockLevel ? 'input-error' : ''}`}
                    placeholder="0"
                    min="0"
                    disabled={modalType === 'view'}
                  />
                  {errors.minStockLevel && <span className="error-text">{errors.minStockLevel}</span>}
                </div>
              </div>

              {modalType !== 'view' && (
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-modal" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-small"></span>
                        {modalType === 'add' ? 'Adding...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        {modalType === 'add' ? '➕ Add Product' : '✓ Update Product'}
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
