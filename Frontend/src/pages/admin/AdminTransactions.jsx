import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout, getUserRole } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import '../Dashboard/Dashboard.css';

function AdminTransactions() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  const username = localStorage.getItem('username') || 'Admin';
  const userRole = getUserRole();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userRole !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    loadTransactions();
  }, [userRole, navigate]);

  const loadTransactions = async () => {
    try {
      const response = await axiosInstance.get('/stock-transactions');
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
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

  const stats = {
    total: transactions.length,
    inbound: transactions.filter(t => t.type === 'STOCK_IN').length,
    outbound: transactions.filter(t => t.type === 'STOCK_OUT').length,
    totalQuantityIn: transactions.filter(t => t.type === 'STOCK_IN').reduce((sum, t) => sum + t.quantity, 0),
    totalQuantityOut: transactions.filter(t => t.type === 'STOCK_OUT').reduce((sum, t) => sum + t.quantity, 0)
  };

  const filteredTransactions = transactions.filter(trans => {
    const matchesFilter = filter === 'all' || trans.type === filter;
    const matchesSearch = searchTerm === '' || 
      trans.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTransactionIcon = (type) => {
    return type === 'STOCK_IN' ? '📥' : '📤';
  };

  const getTransactionColor = (type) => {
    return type === 'STOCK_IN' ? '#48bb78' : '#4299e1';
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${showSidebar ? 'active' : ''}`}>
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}></div>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">📦</span>
              <h2>InvenTrack</h2>
            </div>
            <button className="close-sidebar" onClick={() => setShowSidebar(false)}>✕</button>
          </div>

          <div className="role-indicator-mobile" style={{background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)'}}>
            <span>👑</span>
            <span className="role-text">Admin Panel</span>
          </div>

          <nav className="sidebar-nav">
            <a href="/dashboard" className="nav-item">
              <span className="nav-icon">🏠</span>
              <span>Dashboard</span>
            </a>
            <a href="/admin/users" className="nav-item">
              <span className="nav-icon">👥</span>
              <span>User Management</span>
            </a>
            <a href="/admin/products" className="nav-item">
              <span className="nav-icon">📦</span>
              <span>Products</span>
            </a>
            <a href="/admin/transactions" className="nav-item active">
              <span className="nav-icon">📊</span>
              <span>Transactions</span>
            </a>
            <a href="/admin/alerts" className="nav-item">
              <span className="nav-icon">🔔</span>
              <span>Alerts</span>
            </a>
          </nav>

          <div className="sidebar-footer">
            <div className="user-info-sidebar">
              <div className="user-avatar-large">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <p className="user-name-sidebar">{username}</p>
                <p className="user-email-sidebar">{userEmail}</p>
              </div>
            </div>
            <button className="logout-btn-sidebar" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setShowSidebar(true)}>☰</button>
            <div className="page-title-dash">
              <h1>📊 Transaction History</h1>
              <p className="topbar-subtitle">Complete record of all inventory transactions</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{username}</div>
              <div className="user-role" style={{color: '#fc8181'}}>● Admin</div>
            </div>
          </div>
        </div>

        {/* Transaction Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <span>📊</span>
            </div>
            <div className="stat-details">
              <h3>Total Transactions</h3>
              <div className="stat-number">{stats.total}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <span>📥</span>
            </div>
            <div className="stat-details">
              <h3>Inbound</h3>
              <div className="stat-number">{stats.inbound}</div>
              <span className="stat-change positive">+{stats.totalQuantityIn} items</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)', boxShadow: '0 8px 20px rgba(66, 153, 225, 0.3)'}}>
              <span>📤</span>
            </div>
            <div className="stat-details">
              <h3>Outbound</h3>
              <div className="stat-number">{stats.outbound}</div>
              <span className="stat-change" style={{color: '#4299e1'}}>-{stats.totalQuantityOut} items</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <span>📈</span>
            </div>
            <div className="stat-details">
              <h3>Net Change</h3>
              <div className="stat-number">{stats.totalQuantityIn - stats.totalQuantityOut}</div>
              <span className="stat-change" style={{color: stats.totalQuantityIn >= stats.totalQuantityOut ? '#48bb78' : '#e53e3e'}}>
                {stats.totalQuantityIn >= stats.totalQuantityOut ? '↑' : '↓'} items
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div style={{padding: '0 35px 25px 35px'}}>
          <div style={{background: 'white', padding: '25px 30px', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)', marginBottom: '25px'}}>
            <h2 style={{fontSize: '20px', fontWeight: '800', color: '#1a202c', marginBottom: '20px'}}>Filter & Search</h2>

            {/* Search Bar */}
            <div style={{marginBottom: '20px'}}>
              <input
                type="text"
                placeholder="🔍 Search by product, user, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Filter Buttons */}
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '12px 24px',
                  border: filter === 'all' ? '2px solid #667eea' : '2px solid #e2e8f0',
                  background: filter === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                  color: filter === 'all' ? 'white' : '#4a5568',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: filter === 'all' ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                }}
              >
                📋 All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('STOCK_IN')}
                style={{
                  padding: '12px 24px',
                  border: filter === 'STOCK_IN' ? '2px solid #48bb78' : '2px solid #e2e8f0',
                  background: filter === 'STOCK_IN' ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : 'white',
                  color: filter === 'STOCK_IN' ? 'white' : '#4a5568',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: filter === 'STOCK_IN' ? '0 4px 15px rgba(72, 187, 120, 0.3)' : 'none'
                }}
              >
                📥 Inbound ({stats.inbound})
              </button>
              <button
                onClick={() => setFilter('STOCK_OUT')}
                style={{
                  padding: '12px 24px',
                  border: filter === 'STOCK_OUT' ? '2px solid #4299e1' : '2px solid #e2e8f0',
                  background: filter === 'STOCK_OUT' ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' : 'white',
                  color: filter === 'STOCK_OUT' ? 'white' : '#4a5568',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: filter === 'STOCK_OUT' ? '0 4px 15px rgba(66, 153, 225, 0.3)' : 'none'
                }}
              >
                📤 Outbound ({stats.outbound})
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div style={{background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)'}}>
            <h2 style={{fontSize: '24px', fontWeight: '800', color: '#1a202c', marginBottom: '25px'}}>
              {filter === 'all' ? 'All Transactions' : filter === 'STOCK_IN' ? 'Inbound Transactions' : 'Outbound Transactions'} ({filteredTransactions.length})
            </h2>

            {loading ? (
              <div style={{textAlign: 'center', padding: '60px', color: '#a0aec0'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
                <p style={{fontSize: '18px', fontWeight: '600'}}>Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div style={{textAlign: 'center', padding: '60px', color: '#a0aec0'}}>
                <div style={{fontSize: '64px', marginBottom: '20px'}}>📭</div>
                <h3 style={{fontSize: '24px', fontWeight: '700', color: '#4a5568', marginBottom: '10px'}}>No transactions found</h3>
                <p style={{fontSize: '16px'}}>
                  {searchTerm ? 'Try adjusting your search criteria' : 'No transactions available'}
                </p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {filteredTransactions.map((trans) => (
                  <div
                    key={trans._id}
                    style={{
                      padding: '24px',
                      borderRadius: '14px',
                      border: `2px solid ${getTransactionColor(trans.type)}20`,
                      background: `linear-gradient(135deg, ${getTransactionColor(trans.type)}08 0%, ${getTransactionColor(trans.type)}03 100%)`,
                      transition: 'all 0.3s',
                      boxShadow: `0 2px 8px ${getTransactionColor(trans.type)}15`,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = `0 8px 25px ${getTransactionColor(trans.type)}30`;
                      e.currentTarget.style.borderColor = `${getTransactionColor(trans.type)}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 2px 8px ${getTransactionColor(trans.type)}15`;
                      e.currentTarget.style.borderColor = `${getTransactionColor(trans.type)}20`;
                    }}
                  >
                    <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
                      {/* Transaction Icon */}
                      <div style={{
                        fontSize: '48px',
                        flexShrink: '0',
                        transition: 'all 0.3s'
                      }}>
                        {getTransactionIcon(trans.type)}
                      </div>

                      {/* Transaction Details */}
                      <div style={{flex: '1'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px'}}>
                          <div>
                            <h3 style={{
                              fontSize: '20px',
                              fontWeight: '800',
                              color: '#1a202c',
                              marginBottom: '6px'
                            }}>
                              {trans.productName || 'N/A'}
                            </h3>
                            <p style={{fontSize: '14px', color: '#718096', margin: '0', fontWeight: '600'}}>
                              by {trans.username || 'System'}
                            </p>
                          </div>

                          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                            <span style={{
                              background: getTransactionColor(trans.type),
                              color: 'white',
                              padding: '8px 18px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              boxShadow: `0 4px 12px ${getTransactionColor(trans.type)}40`
                            }}>
                              {trans.type === 'STOCK_IN' ? '📥 INBOUND' : '📤 OUTBOUND'}
                            </span>

                            <span style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              padding: '8px 18px',
                              borderRadius: '20px',
                              fontSize: '16px',
                              fontWeight: '800',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}>
                              {trans.type === 'STOCK_IN' ? '+' : '-'}{trans.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div style={{
                          background: 'rgba(102, 126, 234, 0.08)',
                          padding: '14px 18px',
                          borderRadius: '10px',
                          marginTop: '12px',
                          borderLeft: `4px solid ${getTransactionColor(trans.type)}`
                        }}>
                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
                            <div>
                              <p style={{margin: '0', fontSize: '13px', color: '#718096', fontWeight: '600'}}>DATE & TIME</p>
                              <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#1a202c', fontWeight: '700'}}>
                                📅 {new Date(trans.createdAt).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>

                            {trans.reason && (
                              <div style={{gridColumn: 'span 2'}}>
                                <p style={{margin: '0', fontSize: '13px', color: '#718096', fontWeight: '600'}}>NOTES</p>
                                <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#1a202c', fontWeight: '500'}}>
                                  📝 {trans.reason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminTransactions;