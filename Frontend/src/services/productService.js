import axiosInstance from '../utils/axiosConfig';

export const getAllProducts = async (page = 1, limit = 10, search = '', category = '') => {
  try {
    const params = { page, limit };
    if (search) params.search = search;
    if (category) params.category = category;
    
    const response = await axiosInstance.get('/products', { params });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/products', {
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
    
    const response = await axiosInstance.put(`/products/${id}`, updateData);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const stockIn = async (id, quantity, reason = 'Stock replenishment') => {
  try {
    const response = await axiosInstance.post('/stock-transactions', {
      productId: parseInt(id),
      type: 'STOCK_IN',
      quantity: parseInt(quantity),
      reason: reason || `Stock increased by ${quantity} units`
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const stockOut = async (id, quantity, reason = 'Stock removal') => {
  try {
    const response = await axiosInstance.post('/stock-transactions', {
      productId: parseInt(id),
      type: 'STOCK_OUT',
      quantity: parseInt(quantity),
      reason: reason || `Stock decreased by ${quantity} units`
    });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/products/meta/categories');
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

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
