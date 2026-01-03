import axios from 'axios';

// Environment-based API configuration
const getApiBaseUrl = () => {
  // Check if we're in production
  if (import.meta.env.PROD) {
    // For production deployment on Render
    return import.meta.env.VITE_API_URL || 'https://dayflow-hrms-backend.onrender.com';
  }
  // For development
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor for handling auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      // Redirect to login if not already there
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints configuration
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile'
  },
  admin: {
    employees: '/api/admin/employees',
    leaves: '/api/admin/leaves',
    dashboardStats: '/api/admin/dashboard-stats'
  },
  leaves: {
    base: '/api/leaves',
    user: '/api/leaves/user'
  }
};

export default apiClient;