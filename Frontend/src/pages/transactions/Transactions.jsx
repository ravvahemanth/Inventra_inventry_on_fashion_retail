import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import "./Transactions.css";
import '../Dashboard/Dashboard.css';

function Transactions() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const username = localStorage.getItem('username') || 'User';
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterUser, setFilterUser] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exporting, setExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('transactions');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      console.log('🔄 Loading transactions for role:', userRole);
      const response = await axiosInstance.get('/stock-transactions');
      console.log('📦 Full response:', response);
      
      let data = response.data || [];
      data = Array.isArray(data) ? data : [];
      
      console.log('📊 Raw data from API:', data.length, 'transactions');
      
      // Filter transactions based on role
      if (userRole === 'STAFF') {
        const beforeFilter = data.length;
        data = data.filter(t => (t.username || t.userId) === userEmail);
        console.log(`🔒 Filtered for ${userRole}: ${beforeFilter} → ${data.length} transactions`);
      } else {
        console.log(`👔 ${userRole} sees all transactions: ${data.length}`);
      }
      
      console.log('✅ Final transactions:', data);
      setTransactions(data);
    } catch (error) {
      console.error('❌ Error loading transactions:', error);
      setTransactions([]);
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

  const getActionInfo = (action) => {
    switch (action) {
      case 'STOCK_IN':
        return {
          icon: '📦',
          label: 'STOCK IN',
          color: 'green',
          description: 'Items added to inventory'
        };
      case 'STOCK_OUT':
        return {
          icon: '📤',
          label: 'STOCK OUT',
          color: 'red',
          description: 'Items removed from inventory'
        };
      case 'PRODUCT_CREATED':
        return {
          icon: '➕',
          label: 'PRODUCT CREATED',
          color: 'blue',
          description: 'New product added to catalog'
        };
      case 'PRODUCT_UPDATED':
        return {
          icon: '✏️',
          label: 'PRODUCT UPDATED',
          color: 'orange',
          description: 'Product information modified'
        };
      default:
        return {
          icon: '📝',
          label: action || 'TRANSACTION',
          color: 'gray',
          description: 'General transaction'
        };
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return formatDateTime(timestamp);
  };

  const openExportModal = (type) => {
    setExportType(type);
    setShowExportModal(true);
    setDateRange({ start: '', end: '' });
  };

  const handleExportWithDateRange = async () => {
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      alert('Only Admins and Managers can export data');
      return;
    }
    
    console.log(`📊 Starting ${exportType} export for ${userRole}...`);
    setExporting(true);
    try {
      let url, fileName;
      
      if (exportType === 'transactions') {
        url = '/stock-transactions/export';
        if (dateRange.start && dateRange.end) {
          url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
          fileName = `transactions_${dateRange.start}_to_${dateRange.end}.csv`;
        } else {
          fileName = `transactions_all_${new Date().toISOString().split('T')[0]}.csv`;
        }
        console.log('📋 Exporting transactions from:', url);
      } else {
        url = '/admin/fashion-products/export';
        fileName = `fashion_products_all_${new Date().toISOString().split('T')[0]}.csv`;
        console.log('👗 Exporting fashion products from:', url);
      }

      console.log('🔗 Making request to:', url);
      const response = await axiosInstance.get(url, {
        responseType: 'blob'
      });

      console.log('✅ Export response received, size:', response.data.size);
      
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      console.log('📥 File downloaded:', fileName);
      alert(`✅ ${exportType === 'transactions' ? 'Transactions' : 'Fashion products'} exported successfully!`);
    } catch (error) {
      console.error('❌ Export error:', error);
      alert(`❌ Failed to export ${exportType}: ${error.response?.data?.message || error.message}`);
    } finally {
      setExporting(false);
      setShowExportModal(false);
    }
  };

  // Computed values - fixed duplicate declarations
  const uniqueUsers = ['ALL', ...new Set((Array.isArray(transactions) ? transactions : []).map(t => t.username || t.userId || 'Unknown'))];
  const actionTypes = ['ALL', 'STOCK_IN', 'STOCK_OUT', 'PRODUCT_CREATED', 'PRODUCT_UPDATED'];

  const filteredTransactions = (Array.isArray(transactions) ? transactions : []).filter(transaction => {
    const entityName = transaction.entityName || transaction.productName || '';
    const details = transaction.notes || transaction.details || transaction.reason || '';
    const userId = transaction.username || transaction.userId || '';
    
    const matchesSearch = 
      entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === 'ALL' || 
                          transaction.action === filterAction || 
                          transaction.type === filterAction;
    
    const matchesUser = filterUser === 'ALL' || 
                        transaction.username === filterUser ||
                        transaction.userId === filterUser;

    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const tDate = new Date(transaction.createdAt || transaction.timestamp);
      matchesDate = tDate >= new Date(dateRange.start) && tDate <= new Date(dateRange.end);
    }

    return matchesSearch && matchesAction && matchesUser && matchesDate;
  });

  const stats = {
    total: transactions.length,
    today: transactions.filter(t => {
      const tDate = new Date(t.createdAt || t.timestamp);
      const today = new Date();
      return tDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: transactions.filter(t => {
      const tDate = new Date(t.createdAt || t.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return tDate >= weekAgo;
    }).length
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
            <a href="/admin/transactions" className="nav-item active">
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
              <h1>📝 Transaction History</h1>
              <p className="topbar-subtitle">Complete audit trail of all fashion retail operations</p>
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

        {/* Export Actions */}
        {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
          <div className="fashion-header-actions">
            <div className="header-actions">
              <button 
                className="export-btn"
                onClick={() => openExportModal('transactions')}
                disabled={exporting}
              >
                <span className="btn-icon">📊</span>
                <span>{exporting ? 'Exporting...' : 'Export Transactions'}</span>
              </button>
              <button 
                className="export-btn"
                onClick={() => openExportModal('products')}
                disabled={exporting}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                <span className="btn-icon">👗</span>
                <span>Export Fashion Products</span>
              </button>
            </div>
          </div>
        )}

        <div className="transactions-content">
          <div className="transaction-stats">
            <div className="stat-card stat-card-hover">
              <div className="stat-icon blue">📝</div>
              <div className="stat-details">
                <h3>Total Transactions</h3>
                <p className="stat-number">{stats.total}</p>
                <span className="stat-label">All time records</span>
              </div>
            </div>

            <div className="stat-card stat-card-hover">
              <div className="stat-icon green">📅</div>
              <div className="stat-details">
                <h3>Today</h3>
                <p className="stat-number">{stats.today}</p>
                <span className="stat-label">Recent activity</span>
              </div>
            </div>

            <div className="stat-card stat-card-hover">
              <div className="stat-icon purple">📊</div>
              <div className="stat-details">
                <h3>This Week</h3>
                <p className="stat-number">{stats.thisWeek}</p>
                <span className="stat-label">Last 7 days</span>
              </div>
            </div>

            <div className="stat-card stat-card-hover">
              <div className="stat-icon orange">🔍</div>
              <div className="stat-details">
                <h3>Filtered Results</h3>
                <p className="stat-number">{filteredTransactions.length}</p>
                <span className="stat-label">Current view</span>
              </div>
            </div>
          </div>

          <div className="transaction-filters">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, user, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Action Type</label>
              <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
                {actionTypes.map(action => (
                  <option key={action} value={action}>
                    {action === 'ALL' ? 'All Actions' : action.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
              <div className="filter-group">
                <label>User Filter</label>
                <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
                  {uniqueUsers.map(user => (
                    <option key={user} value={user}>{user === 'ALL' ? 'All Users' : user}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="filter-group date-range">
              <label>From Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <label>To Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No Transactions Found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="transactions-timeline">
              {filteredTransactions.map(transaction => {
                const actionInfo = getActionInfo(transaction.type || transaction.action);
                return (
                  <div key={transaction.transactionId || transaction.id} className="transaction-item">
                    <div className={`transaction-icon transaction-icon-hover ${actionInfo.color}`}>
                      <span className="icon-emoji">{actionInfo.icon}</span>
                    </div>

                    <div className="transaction-line"></div>

                    <div className="transaction-content-wrapper">
                      <div className="transaction-content transaction-content-hover">
                        <div className="transaction-header-row">
                          <div className="header-left">
                            <span className={`action-badge action-badge-${actionInfo.color}`}>
                              {actionInfo.label}
                            </span>
                            <h3 className="entity-name">{transaction.entityName || transaction.productName || 'Fashion Item'}</h3>
                          </div>
                          <span className="transaction-time" title={formatDateTime(transaction.createdAt || transaction.timestamp)}>
                            🕐 {formatTimeAgo(transaction.createdAt || transaction.timestamp)}
                          </span>
                        </div>

                        <p className="transaction-details">{transaction.details || transaction.notes || transaction.reason}</p>

                        <div className="transaction-meta">
                          <div className="meta-item">
                            <span className="meta-label">👤 User</span>
                            <span className="meta-value">{transaction.userId || transaction.username || 'System'}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">📦 Quantity</span>
                            <span className="meta-value">{transaction.quantity || 0} units</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">🔢 Transaction ID</span>
                            <span className="meta-value">#{transaction.transactionId || transaction.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{exportType === 'transactions' ? '📊 Export Transactions' : '👗 Export Fashion Products'}</h2>
              <button onClick={() => setShowExportModal(false)} className="close-modal">✕</button>
            </div>

            <div className="modal-body">
              {exportType === 'transactions' && (
                <div className="date-range-section">
                  <h3>📅 Date Range (Optional)</h3>
                  <p>Leave empty to export all transactions</p>
                  <div className="date-inputs">
                    <div className="date-input-group">
                      <label>From Date</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      />
                    </div>
                    <div className="date-input-group">
                      <label>To Date</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="export-info">
                <h4>📋 Export Details:</h4>
                <ul>
                  {exportType === 'transactions' ? (
                    <>
                                <li>Transaction date and time</li>
                      <li>Product name and ID</li>
                      <li>Transaction type (Stock In/Out)</li>
                      <li>Quantity and user details</li>
                      <li>Reason and notes</li>
                    </>
                  ) : (
                    <>
                      <li>Fashion product details</li>
                      <li>Brand, category, and season</li>
                      <li>Size and color variants</li>
                      <li>Stock levels and pricing</li>
                      <li>Material and care instructions</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowExportModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button 
                onClick={handleExportWithDateRange}
                disabled={exporting}
                className="export-btn"
              >
                {exporting ? '⏳ Exporting...' : `📥 Export ${exportType === 'transactions' ? 'Transactions' : 'Products'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;