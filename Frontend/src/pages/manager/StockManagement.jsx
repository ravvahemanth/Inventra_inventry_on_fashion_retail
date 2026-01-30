import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import '../Dashboard/Dashboard.css';

const StockManagement = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const username = localStorage.getItem('username') || 'Manager';
  const userEmail = localStorage.getItem('userEmail') || 'Manager';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (userRole !== 'MANAGER') {
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

  const handleStockUpdate = async (productId, type, quantity, reason) => {
    try {
      await axiosInstance.post('/stock-transactions', {
        productId,
        type,
        quantity,
        reason
      });
      fetchProducts(); // Refresh data
      alert(`Stock ${type === 'STOCK_IN' ? 'added' : 'removed'} successfully!`);
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock: ' + (error.response?.data?.message || error.message));
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

          <div className="role-indicator-mobile" style={{ backgroundColor: '#667eea' }}>
            <span>👔</span>
            <span className="role-text">Manager</span>
          </div>

          <nav className="sidebar-nav">
            <a href="/dashboard" className="nav-item">
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/manager/stock" className="nav-item active">
              <span className="nav-icon">📦</span>
              <span>Update Stock</span>
            </a>
            <a href="/manager/alerts" className="nav-item">
              <span className="nav-icon">🔔</span>
              <span>View Alerts</span>
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
              <h1>Stock Management 📦</h1>
              <p className="topbar-subtitle">Update product stock levels</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{username}</span>
              <span className="user-role" style={{ color: '#667eea' }}>
                👔 Manager
              </span>
            </div>
          </div>
        </div>

        {/* Products Table with Stock Management */}
        <div className="recent-activity">
          <h2>📦 Update Product Stock</h2>
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
                          onClick={() => {
                            const quantity = prompt('Enter quantity to add:');
                            const reason = prompt('Enter reason (optional):') || 'Stock replenishment';
                            if (quantity && parseInt(quantity) > 0) {
                              handleStockUpdate(product.id, 'STOCK_IN', parseInt(quantity), reason);
                            }
                          }}
                        >
                          ⬆️ Stock In
                        </button>
                        <button 
                          className="stock-btn stock-out"
                          onClick={() => {
                            const quantity = prompt('Enter quantity to remove:');
                            const reason = prompt('Enter reason (optional):') || 'Stock removal';
                            if (quantity && parseInt(quantity) > 0) {
                              handleStockUpdate(product.id, 'STOCK_OUT', parseInt(quantity), reason);
                            }
                          }}
                        >
                          ⬇️ Stock Out
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

export default StockManagement;