import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';


const API_URL = 'http://localhost:8888/api/admin';

// Set up axios interceptor to add token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPendingUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/pending-users`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const approveUser = async (userId) => {
  try {
    const response = await axios.patch(`${API_URL}/users/${userId}/status`, {
      status: 'approved'
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const rejectUser = async (userId) => {
  try {
    const response = await axios.patch(`${API_URL}/users/${userId}/status`, {
      status: 'rejected'
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};