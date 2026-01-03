import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leaves';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const applyLeave = async (leaveData) => {
  const response = await axios.post(`${API_URL}/apply`, leaveData, getAuthHeader());
  return response.data;
};

export const getMyLeaves = async () => {
  const response = await axios.get(`${API_URL}/my-leaves`, getAuthHeader());
  return response.data;
};

export const getAllLeaves = async () => {
  const response = await axios.get(`${API_URL}/all`, getAuthHeader());
  return response.data;
};

export const updateLeaveStatus = async (id, status, adminComment = '') => {
  const response = await axios.put(
    `${API_URL}/${id}/status`,
    { status, adminComment },
    getAuthHeader()
  );
  return response.data;
};
