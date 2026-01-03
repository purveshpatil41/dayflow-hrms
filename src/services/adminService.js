import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

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
    const response = await axios.get(`${API_URL}/employees`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch employees' };
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/employees/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch employee' };
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/employees/${id}`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update employee' };
  }
};

export const getEmployeeAttendance = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/employees/${id}/attendance`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch attendance' };
  }
};

export const getEmployeeLeaves = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/employees/${id}/leaves`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch leaves' };
  }
};

export const markAttendance = async (employeeId, date, status) => {
  try {
    const response = await axios.post(`${API_URL}/attendance/mark`, 
      { employeeId, date, status }, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark attendance' };
  }
};

export const markBulkAttendance = async (attendanceRecords) => {
  try {
    const response = await axios.post(`${API_URL}/attendance/mark-bulk`, 
      { attendanceRecords }, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark bulk attendance' };
  }
};
