import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import '../Dashboard/Dashboard.css';

const ProductManagement = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const username = localStorage.getItem('username') || 'Admin';
  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    minStockLevel: '',
    price: ''
  });

  useEffect(() => {
    if (userRole !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchProducts();
  }, [userRole, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        minStockLevel: parseInt(formData.minStockLevel),
        price: parseFloat(formData.price)
      };

      if (editingProduct) {
        await axiosInstance.put(`/products/${editingProduct.id}`, productData);
        alert('Product updated successfully!');
      } else {
        await axiosInstance.post('/products', productData);
        alert('Product added successfully!');
      }

      setFormData({
        name: '',
        description: '',
        category: '',
        quantity: '',
        minStockLevel: '',
        price: ''
      });
      setShowAddForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      quantity: product.quantity.toString(),
      minStockLevel: product.minStockLevel.toString(),
      price: product.price.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`/products/${productId}`);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + (error.response?.data?.message || error.message));
      }
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
              <span className="logo-icon">📦</span>
              <h2>Inventra</h2>
            </div>
            <button className="close-sidebar" onClick={() => setShowSidebar(false)}>✕</button>
          </div>

          <div className="role-indicator-mobile" style={{ backgroundColor: '#9f7aea' }}>
            <span>👑</span>
            <span className="role-text">Administrator</span>
          </div>

          <nav className="sidebar-nav">
            <a href="/dashboard" className="nav-item">
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/admin/products" className="nav-item active">
              <span className="nav-icon">📦</span>
              <span>Manage Products</span>
            </a>
            <a href="/admin/alerts" className="nav-item">
              <span className="nav-icon">🔔</span>
              <span>View Alerts</span>
            </a>
            <a href="/admin/users" className="nav-item">
              <span className="nav-icon">👥</span>
              <span>User Management</span>
            </a>
            <a href="/admin/transactions" className="nav-item">
              <span className="nav-icon">📈</span>
              <span>Transactions</span>
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
              <h1>Product Management 📦</h1>
              <p className="topbar-subtitle">Add, edit, and manage your inventory products</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role" style={{ color: '#9f7aea' }}>
                👑 Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="dashboard-stats">
          <button 
            className="action-btn action-btn-primary"
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
              setFormData({
                name: '',
                description: '',
                category: '',
                quantity: '',
                minStockLevel: '',
                price: ''
              });
            }}
          >
            <span className="action-icon">➕</span>
            <div className="action-text">
              <span className="action-title">Add New Product</span>
              <span className="action-subtitle">Create a new inventory item</span>
            </div>
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="recent-activity">
            <h2>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter category"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Initial Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Stock Level *</label>
                  <input
                    type="number"
                    name="minStockLevel"
                    value={formData.minStockLevel}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="action-btn action-btn-primary">
                  {editingProduct ? '✓ Update Product' : '➕ Add Product'}
                </button>
                <button 
                  type="button" 
                  className="action-btn action-btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="recent-activity">
          <h2>📦 All Products ({products.length})</h2>
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Min Level</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <strong>{product.name}</strong>
                        {product.description && <div className="product-desc">{product.description}</div>}
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{product.category}</span>
                    </td>
                    <td>
                      <span className={`stock-quantity ${
                        product.quantity === 0 ? 'out-of-stock' : 
                        product.lowStock ? 'low-stock' : 'in-stock'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td>{product.minStockLevel}</td>
                    <td>
                      <span className={`status-badge ${
                        product.quantity === 0 ? 'status-out' : 
                        product.lowStock ? 'status-low' : 'status-good'
                      }`}>
                        {product.quantity === 0 ? 'Out of Stock' : 
                         product.lowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>₹{product.price}</td>
                    <td>
                      <div className="stock-actions">
                        <button 
                          className="stock-btn stock-in"
                          onClick={() => handleEdit(product)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="stock-btn stock-out"
                          onClick={() => handleDelete(product.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
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

export default ProductManagement;