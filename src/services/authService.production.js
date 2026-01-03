import axios from 'axios';

// Dynamic API URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-app.railway.app' // Update this with your actual Railway backend URL
  : 'http://localhost:5000';

const API_URL = `${API_BASE_URL}/api/auth`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('userRole', response.data.data.user.role);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Invalid token:', error);
    logout();
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.error('Token validation failed:', error);
    logout();
    return false;
  }
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Add axios interceptor for token
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getUserRole
};