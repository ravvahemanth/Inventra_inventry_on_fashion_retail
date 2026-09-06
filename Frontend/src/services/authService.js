import axiosInstance from '../utils/axiosConfig';

export const login = async (credentials) => {
  try {
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };
    
    const response = await axiosInstance.post('/auth/login', loginData);
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('userEmail', response.data.user.email || credentials.email);
        localStorage.setItem('userRole', (response.data.user.role || 'USER').toUpperCase());
        localStorage.setItem('username', response.data.user.username || 'User');
      }
    }
    
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed';
    throw new Error(message);
  }
};

export const firebaseLogin = async (firebaseUserData) => {
  try {
    const response = await axiosInstance.post('/auth/firebase-login', firebaseUserData);

    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userRole', (response.data.user.role || 'USER').toUpperCase());
        localStorage.setItem('username', response.data.user.username);
      }
    }

    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Google sign-in failed';
    throw new Error(message);
  }
};

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', {
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      password: userData.password,
      role: userData.role || 'staff'
    });
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed';
    throw new Error(message);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to send OTP';
    throw new Error(message);
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Invalid OTP';
    throw new Error(message);
  }
};

export const resetPassword = async (email, otp, newPassword, confirmPassword) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', {
      email,
      otp,
      newPassword,
      confirmPassword
    });
    return response;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Password reset failed';
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    // Ignore server error on logout
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
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
