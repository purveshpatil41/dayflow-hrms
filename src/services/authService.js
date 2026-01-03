import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

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
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

export const verifyOTP = async (otpData) => {
  const response = await api.post('/verify-otp', otpData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const deleteAccount = async () => {
  try {
    const token = getToken();
    console.log('Delete account - Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.delete('/delete-account', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('Delete account response:', response.data);
    
    if (response.data.success) {
      logout(); // Clear localStorage after successful deletion
    }
    return response.data;
  } catch (error) {
    console.error('Delete account service error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};

export default api;
