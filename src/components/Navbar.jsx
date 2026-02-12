import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Safely parse user from localStorage
  const getUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };
  
  const user = getUser();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo">
            <span className="logo-text">ResumeCheck</span>
            <span className="logo-badge">Pro</span>
          </Link>
        </div>

        <div className="navbar-menu">
          {token ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <i className="nav-icon">📊</i>
                <span>Dashboard</span>
              </Link>
              
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link">
                  <i className="nav-icon">👨‍💼</i>
                  <span>Admin</span>
                </Link>
              )}
              
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className="user-role">{user?.role || 'user'}</span>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                  <i className="logout-icon">🚪</i>
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <i className="nav-icon">🔑</i>
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;