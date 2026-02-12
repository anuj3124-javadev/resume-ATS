import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Loader from '../components/Loader';
import '../styles/admin.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, resumesRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getResumes()
      ]);
      
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }
      
      if (resumesRes.data.success) {
        setResumes(resumesRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      try {
        await adminAPI.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        // Also remove user's resumes
        setResumes(resumes.filter(resume => resume.user.id !== id));
      } catch (error) {
        console.error('Delete user error:', error);
        setError('Failed to delete user');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResumes = resumes.filter(resume =>
    resume.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    totalResumes: resumes.length,
    averageScore: resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + r.score, 0) / resumes.length)
      : 0,
    adminUsers: users.filter(u => u.role === 'admin').length
  };

  if (loading) {
    return <Loader message="Loading admin panel..." />;
  }

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p className="admin-subtitle">
              Manage users and resumes
            </p>
          </div>
          <div className="admin-stats">
            <div className="stat">
              <span className="stat-number">{stats.totalUsers}</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.totalResumes}</span>
              <span className="stat-label">Resumes</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.averageScore}%</span>
              <span className="stat-label">Avg Score</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.adminUsers}</span>
              <span className="stat-label">Admins</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search users, emails, or resumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search"
              >
                ×
              </button>
            )}
          </div>
          <div className="tab-switcher">
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users ({users.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'resumes' ? 'active' : ''}`}
              onClick={() => setActiveTab('resumes')}
            >
              Resumes ({resumes.length})
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-table-container">
            <div className="table-header">
              <h3>All Users</h3>
              <span className="table-count">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {filteredUsers.length === 0 ? (
              <div className="empty-table">
                <p>No users found</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td className="user-id">#{user.id}</td>
                        <td className="user-name">
                          <div className="name-wrapper">
                            <span className="name">{user.name}</span>
                            {user.role === 'admin' && (
                              <span className="role-badge admin">Admin</span>
                            )}
                          </div>
                        </td>
                        <td className="user-email">{user.email}</td>
                        <td className="user-role">
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="user-joined">{formatDate(user.created_at)}</td>
                        <td className="user-actions">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="btn-delete"
                              title="Delete User"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Resumes Tab */}
        {activeTab === 'resumes' && (
          <div className="resumes-table-container">
            <div className="table-header">
              <h3>All Resumes</h3>
              <span className="table-count">
                {filteredResumes.length} resume{filteredResumes.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {filteredResumes.length === 0 ? (
              <div className="empty-table">
                <p>No resumes found</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="resumes-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>File</th>
                      <th>Score</th>
                      <th>Keywords</th>
                      <th>Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResumes.map(resume => (
                      <tr key={resume.id}>
                        <td className="resume-id">#{resume.id}</td>
                        <td className="resume-user">
                          <div>
                            <div className="user-name">{resume.user.name}</div>
                            <div className="user-email">{resume.user.email}</div>
                          </div>
                        </td>
                        <td className="resume-file">
                          <div className="file-info">
                            <span className="file-icon">📄</span>
                            <span className="file-name">{resume.fileName}</span>
                          </div>
                        </td>
                        <td className="resume-score">
                          <div className={`score-badge ${
                            resume.score >= 80 ? 'excellent' :
                            resume.score >= 60 ? 'good' :
                            resume.score >= 40 ? 'fair' : 'poor'
                          }`}>
                            {resume.score}%
                          </div>
                        </td>
                        <td className="resume-keywords">
                          {resume.analysis.details.skills_found}
                        </td>
                        <td className="resume-date">
                          {formatDate(resume.uploadedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Summary Card */}
        <div className="summary-card">
          <div className="summary-item">
            <h4>Recent Activity</h4>
            <p>
              Last resume uploaded: {
                resumes.length > 0 
                  ? formatDate(resumes[0].uploadedAt)
                  : 'No resumes yet'
              }
            </p>
          </div>
          <div className="summary-item">
            <h4>System Status</h4>
            <div className="status-indicators">
              <div className="status-indicator online">
                <span className="status-dot"></span>
                <span className="status-text">API Online</span>
              </div>
              <div className="status-indicator healthy">
                <span className="status-dot"></span>
                <span className="status-text">Database Healthy</span>
              </div>
            </div>
          </div>
          <div className="summary-item">
            <h4>Quick Actions</h4>
            <div className="quick-actions">
              <button
                onClick={fetchData}
                className="btn-refresh"
              >
                ↻ Refresh Data
              </button>
              <button
                onClick={() => window.print()}
                className="btn-print"
              >
                🖨️ Print Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;