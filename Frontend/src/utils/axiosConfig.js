import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8888/api', // ✅ Correct base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', config.url);
    } else {
      console.warn('⚠️ No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response received from:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        console.error('🔒 Unauthorized! Redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        console.error('🚫 Forbidden! You do not have permission.');
      } else if (error.response.status === 404) {
        console.error('🔍 Not found!');
      } else if (error.response.status === 500) {
        console.error('💥 Server error!');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('📡 No response from server. Is backend running?');
    } else {
      // Something else happened
      console.error('⚠️ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
