import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeReport from './pages/ResumeReport';
import AdminPanel from './pages/AdminPanel';
import { getCurrentUser, getAuthToken } from './utils/storage';
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = getCurrentUser();
  const token = getAuthToken();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const user = getCurrentUser();
  const token = getAuthToken();

  if (token && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Loading component
const LoadingScreen = () => (
  <div className="app-loading">
    <div className="loading-spinner"></div>
  </div>
);

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Don't show navbar on auth pages
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      {/* Show navbar on all pages except auth pages */}
      {!hideNavbar && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/report/:id" element={
          <ProtectedRoute>
            <ResumeReport />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;