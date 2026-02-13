import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://resume-atsb.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        window.location.href = '/dashboard';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me')
};

// Resume API calls
export const resumeAPI = {
  upload: (formData) => API.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getMyResumes: () => API.get('/resume/my'),
  getResume: (id) => API.get(`/resume/${id}`),
  deleteResume: (id) => API.delete(`/resume/${id}`)
};

// Admin API calls
export const adminAPI = {
  getUsers: () => API.get('/admin/users'),
  getResumes: () => API.get('/admin/resumes'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`)
};

export default API;