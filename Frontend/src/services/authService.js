import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';


const API_URL = 'http://localhost:8888/api/auth';

// Set up axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Function to set auth token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Set token on app load if available
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export const login = async (credentials) => {
  try {
    // Send email and password to backend
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };
    
    const response = await axios.post(`${API_URL}/login`, loginData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('userRole', response.data.user.role.toUpperCase());
      localStorage.setItem('username', response.data.user.username);
      
      // Set token for future requests
      setAuthToken(response.data.token);
    }
    
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      password: userData.password,
      role: userData.role || 'staff' // Default to staff, can be manager
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetPassword = async (email, otp, newPassword, confirmPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      email,
      otp,
      newPassword,
      confirmPassword
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
  } catch (error) {
    // Continue with logout even if API call fails
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setAuthToken(null);
    window.location.href = '/login';
  }
};

export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'USER';
};

export const isAdmin = () => {
  return getUserRole() === 'ADMIN';
};

export const isManager = () => {
  return getUserRole() === 'MANAGER' || getUserRole() === 'ADMIN';
};

export const isStaff = () => {
  return getUserRole() === 'STAFF';
};
