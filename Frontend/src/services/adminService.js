import axiosInstance from '../utils/axiosConfig';

export const getPendingUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/pending-users');
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/users');
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const approveUser = async (userId) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}/status`, {
      status: 'approved'
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const rejectUser = async (userId) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}/status`, {
      status: 'rejected'
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/stats');
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};