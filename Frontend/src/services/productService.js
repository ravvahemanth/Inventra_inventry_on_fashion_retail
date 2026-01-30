import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';

const API_URL = 'http://localhost:8888/api/products';

// Set up axios interceptor to add token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllProducts = async (page = 1, limit = 10, search = '', category = '') => {
  try {
    const params = { page, limit };
    if (search) params.search = search;
    if (category) params.category = category;
    
    const response = await axios.get(API_URL, { params });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, {
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: parseFloat(productData.price || productData.unitPrice),
      quantity: parseInt(productData.stockQuantity || productData.quantity),
      minStockLevel: parseInt(productData.minStockLevel || 10),
      sku: productData.sku
    });
    
    return {
      data: {
        success: true,
        message: 'Product added successfully',
        ...response.data
      }
    };
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const updateData = {};
    if (productData.name) updateData.name = productData.name;
    if (productData.description) updateData.description = productData.description;
    if (productData.category) updateData.category = productData.category;
    if (productData.price || productData.unitPrice) updateData.price = parseFloat(productData.price || productData.unitPrice);
    if (productData.stockQuantity !== undefined || productData.quantity !== undefined) {
      updateData.quantity = parseInt(productData.stockQuantity || productData.quantity);
    }
    if (productData.minStockLevel !== undefined) updateData.minStockLevel = parseInt(productData.minStockLevel);
    if (productData.sku) updateData.sku = productData.sku;
    
    const response = await axios.put(`${API_URL}/${id}`, updateData);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ FIXED: Use correct endpoint /stock-transactions
export const stockIn = async (id, quantity, reason = 'Stock replenishment') => {
  try {
    console.log('📥 Stock In Request:', { productId: id, quantity, reason });
    
    const response = await axios.post('http://localhost:8888/api/stock-transactions', {
      productId: parseInt(id),
      type: 'STOCK_IN', // Changed from 'IN' to 'STOCK_IN'
      quantity: parseInt(quantity),
      reason: reason || `Stock increased by ${quantity} units`
    });
    
    console.log('✅ Stock In Success:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Stock In Error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

// ✅ FIXED: Use correct endpoint /stock-transactions
export const stockOut = async (id, quantity, reason = 'Stock removal') => {
  try {
    console.log('📤 Stock Out Request:', { productId: id, quantity, reason });
    
    const response = await axios.post('http://localhost:8888/api/stock-transactions', {
      productId: parseInt(id),
      type: 'STOCK_OUT', // Changed from 'OUT' to 'STOCK_OUT'
      quantity: parseInt(quantity),
      reason: reason || `Stock decreased by ${quantity} units`
    });
    
    console.log('✅ Stock Out Success:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Stock Out Error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/meta/categories`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export all functions
export default {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  stockIn,
  stockOut,
  getCategories
};
