import axios from 'axios';

// Smart API Base URL resolver:
// 1. Explicit VITE_API_BASE_URL (if provided in env)
// 2. If running in production (Vercel, custom domain, https://), use Render cloud backend
// 3. If running locally on localhost/127.0.0.1, use http://localhost:8888
const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  // If env explicitly provided and not default localhost while on live web
  if (envUrl && typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }

  // Live web / Vercel deployment -> always use secure Render backend
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://inventra-backend-1ctb.onrender.com/api';
  }

  // Local development default
  const localDefault = envUrl || 'http://localhost:8888';
  return localDefault.endsWith('/api') ? localDefault : `${localDefault.replace(/\/$/, '')}/api`;
};

const baseURL = resolveApiBaseUrl();
console.log('🌐 Inventra API Base URL configured:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30s timeout for cloud spin-up resilience
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
axiosInstance.interceptors.request.use(
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

// Response interceptor - Handle token expiration & errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPath = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
      if (!isAuthPath) {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
