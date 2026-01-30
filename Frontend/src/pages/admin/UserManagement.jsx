import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserRole, logout } from '../../services/authService';
import { getAllUsers, approveUser, rejectUser, deleteUser } from '../../services/adminService';
import './UserManagement.css';

function UserManagement() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const username = localStorage.getItem('username') || 'Admin';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userRole !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [userRole, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      loadUsers();
      alert('User approved successfully!');
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      try {
        await rejectUser(userId);
        loadUsers();
        alert('User rejected successfully!');
      } catch (error) {
        console.error('Error rejecting user:', error);
        alert('Failed to reject user');
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        loadUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const getFilteredUsers = () => {
    let filtered = users;
    
    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(user => user.status.toLowerCase() === filter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { icon: '⏳', text: 'Pending', class: 'status-pending' },
      approved: { icon: '✅', text: 'Approved', class: 'status-approved' },
      rejected: { icon: '❌', text: 'Rejected', class: 'status-rejected' }
    };
    
    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    return (
      <span className={`role-badge ${role === 'ADMIN' ? 'role-admin' : 'role-manager'}`}>
        {role === 'ADMIN' ? '👑 Admin' : '👔 Manager'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      {/* Header Section */}
      <div className="um-header">
        <div className="um-header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </button>
          <div className="um-title-section">
            <h1>👥 User Management</h1>
            <p>Manage user accounts, permissions, and access control</p>
          </div>
        </div>
        <div className="um-header-right">
          <div className="user-profile-card">
            <div className="user-avatar-lg">{username.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <span className="user-name-lg">{username}</span>
              <span className="user-role-lg">👑 Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="um-stats-grid">
        <div className="um-stat-card total">
          <div className="stat-icon-wrapper blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <h3 className="stat-value">{users.length}</h3>
            <span className="stat-trend positive">All accounts</span>
          </div>
        </div>

        <div className="um-stat-card pending">
          <div className="stat-icon-wrapper orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Approval</p>
            <h3 className="stat-value">{users.filter(u => u.status === 'PENDING').length}</h3>
            <span className="stat-trend warning">Needs attention</span>
          </div>
        </div>

        <div className="um-stat-card approved">
          <div className="stat-icon-wrapper green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Approved</p>
            <h3 className="stat-value">{users.filter(u => u.status === 'APPROVED').length}</h3>
            <span className="stat-trend positive">Active accounts</span>
          </div>
        </div>

        <div className="um-stat-card rejected">
          <div className="stat-icon-wrapper red">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Rejected</p>
            <h3 className="stat-value">{users.filter(u => u.status === 'REJECTED').length}</h3>
            <span className="stat-trend negative">Denied access</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="um-controls">
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Users', count: users.length },
            { key: 'pending', label: 'Pending', count: users.filter(u => u.status === 'PENDING').length },
            { key: 'approved', label: 'Approved', count: users.filter(u => u.status === 'APPROVED').length },
            { key: 'rejected', label: 'Rejected', count: users.filter(u => u.status === 'REJECTED').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
            >
              {tab.label} <span className="count-badge">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="um-users-section">
        <div className="section-header">
          <h2>Users List</h2>
          <span className="result-count">{getFilteredUsers().length} {getFilteredUsers().length === 1 ? 'user' : 'users'} found</span>
        </div>

        {getFilteredUsers().length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No users found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="users-grid">
            {getFilteredUsers().map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar-circle">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info-section">
                    <h3 className="user-name-title">{user.username}</h3>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-badges">
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                  </div>
                </div>

                <div className="user-card-meta">
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                    </svg>
                    <span>Registered: {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>

                {user.role !== 'ADMIN' ? (
                  <div className="user-card-actions">
                    {user.status === 'PENDING' && (
                      <>
                        <button className="action-btn approve" onClick={() => handleApprove(user.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Approve
                        </button>
                        <button className="action-btn reject" onClick={() => handleReject(user.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Reject
                        </button>
                      </>
                    )}

                    {user.status === 'REJECTED' && (
                      <button className="action-btn approve" onClick={() => handleApprove(user.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Approve
                      </button>
                    )}

                    {user.status === 'APPROVED' && (
                      <button className="action-btn reject" onClick={() => handleReject(user.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Reject
                      </button>
                    )}

                    <button className="action-btn delete" onClick={() => handleDelete(user.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="admin-protected">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Protected Admin Account
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
