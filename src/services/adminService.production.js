import axios from 'axios';

// Dynamic API URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-app.railway.app' // Update this with your actual Railway backend URL
  : 'http://localhost:5000';

const API_URL = `${API_BASE_URL}/api/admin`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getAllEmployees = async () => {
  try {
    const response = await axios.get(API_URL + '/employees', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const getEmployee = async (employeeId) => {
  try {
    const response = await axios.get(API_URL + `/employees/${employeeId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
};

export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const response = await axios.put(API_URL + `/employees/${employeeId}`, employeeData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(API_URL + `/employees/${employeeId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(API_URL + '/dashboard-stats', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getAllLeaves = async () => {
  try {
    const response = await axios.get(API_URL + '/leaves', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching leaves:', error);
    throw error;
  }
};

export const updateLeaveStatus = async (leaveId, status, adminNotes = '') => {
  try {
    const response = await axios.patch(API_URL + `/leaves/${leaveId}`, { 
      status, 
      adminNotes 
    }, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating leave status:', error);
    throw error;
  }
};

export default {
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
  getAllLeaves,
  updateLeaveStatus
};