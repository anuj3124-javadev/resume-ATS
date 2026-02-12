/**
 * Safe localStorage helper functions
 */

// Get item with safe JSON parsing
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === 'undefined') {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Set item with safe JSON stringify
export const setLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

// Remove item
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// Clear all storage
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Auth specific helpers
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getCurrentUser = () => {
  return getLocalStorage('user');
};

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  setLocalStorage('user', user);
};

export const clearAuthData = () => {
  removeLocalStorage('token');
  removeLocalStorage('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};