import axios from 'axios';

// Dynamic API URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-app.railway.app' // Update this with your actual Railway backend URL
  : 'http://localhost:5000';

const API_URL = `${API_BASE_URL}/api/leaves`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const submitLeave = async (leaveData) => {
  try {
    const response = await axios.post(API_URL, leaveData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error submitting leave:', error);
    throw error;
  }
};

export const getUserLeaves = async () => {
  try {
    const response = await axios.get(API_URL + '/user', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching user leaves:', error);
    throw error;
  }
};

export const getLeaveById = async (leaveId) => {
  try {
    const response = await axios.get(API_URL + `/${leaveId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching leave:', error);
    throw error;
  }
};

export const updateLeave = async (leaveId, leaveData) => {
  try {
    const response = await axios.put(API_URL + `/${leaveId}`, leaveData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating leave:', error);
    throw error;
  }
};

export const deleteLeave = async (leaveId) => {
  try {
    const response = await axios.delete(API_URL + `/${leaveId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error deleting leave:', error);
    throw error;
  }
};

export default {
  submitLeave,
  getUserLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave
};