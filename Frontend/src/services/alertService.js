import axios from 'axios';

const API_URL = 'http://localhost:8888/api/alerts';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// ✅ Get all alerts
export const getAllAlerts = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeader());
    console.log('All Alerts Response:', response.data);
    // Backend returns { success: true, message: "...", data: [...] }
    return {
      data: {
        alerts: response.data.data || []
      }
    };
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return { data: { alerts: [] } };
  }
};

// ✅ Get active alerts only
export const getActiveAlerts = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`, getAuthHeader());
    console.log('Active Alerts Response:', response.data);
    
    // Transform backend response to match your component's expected format
    const alerts = (response.data.data || []).map(alert => ({
      alertId: alert.id,
      productId: alert.product?.id,
      productName: alert.product?.name,
      message: alert.message,
      alertType: alert.type, // LOW_STOCK or OUT_OF_STOCK
      type: alert.type,
      currentStock: alert.product?.quantity,
      minStockLevel: alert.product?.minStockLevel,
      timestamp: alert.createdAt,
      createdAt: alert.createdAt,
      resolved: alert.status === 'RESOLVED',
      isRead: alert.status === 'RESOLVED',
      status: alert.status
    }));

    return {
      data: {
        alerts: alerts
      }
    };
  } catch (error) {
    console.error('Error fetching active alerts:', error);
    return { data: { alerts: [] } };
  }
};

// ✅ Get recent alerts (top 10)
export const getRecentAlerts = async () => {
  try {
    const response = await axios.get(`${API_URL}/recent`, getAuthHeader());
    console.log('Recent Alerts Response:', response.data);
    
    const alerts = (response.data.data || []).map(alert => ({
      alertId: alert.id,
      productId: alert.product?.id,
      productName: alert.product?.name,
      message: alert.message,
      alertType: alert.type,
      type: alert.type,
      currentStock: alert.product?.quantity,
      minStockLevel: alert.product?.minStockLevel,
      timestamp: alert.createdAt,
      createdAt: alert.createdAt,
      resolved: alert.status === 'RESOLVED',
      isRead: alert.status === 'RESOLVED',
      status: alert.status
    }));

    return {
      data: {
        alerts: alerts
      }
    };
  } catch (error) {
    console.error('Error fetching recent alerts:', error);
    return { data: { alerts: [] } };
  }
};

// ✅ Get alerts by type (LOW_STOCK or OUT_OF_STOCK)
export const getAlertsByType = async (type) => {
  try {
    const response = await axios.get(`${API_URL}/type/${type.toUpperCase()}`, getAuthHeader());
    console.log(`${type} Alerts Response:`, response.data);
    
    const alerts = (response.data.data || []).map(alert => ({
      alertId: alert.id,
      productId: alert.product?.id,
      productName: alert.product?.name,
      message: alert.message,
      alertType: alert.type,
      type: alert.type,
      currentStock: alert.product?.quantity,
      minStockLevel: alert.product?.minStockLevel,
      timestamp: alert.createdAt,
      createdAt: alert.createdAt,
      resolved: alert.status === 'RESOLVED',
      isRead: alert.status === 'RESOLVED',
      status: alert.status
    }));

    return {
      data: {
        alerts: alerts
      }
    };
  } catch (error) {
    console.error(`Error fetching ${type} alerts:`, error);
    return { data: { alerts: [] } };
  }
};

// ✅ Resolve alert
export const resolveAlert = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/resolve`, {}, getAuthHeader());
    console.log('Resolve Alert Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error resolving alert:', error);
    throw error;
  }
};

// ✅ Mark all alerts as resolved
export const markAllAsRead = async () => {
  try {
    const response = await axios.put(`${API_URL}/mark-all-resolved`, {}, getAuthHeader());
    console.log('Mark All Resolved Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error marking all as resolved:', error);
    throw error;
  }
};

// ✅ Delete alert (Admin only)
export const deleteAlert = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    console.log('Delete Alert Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error deleting alert:', error);
    throw error;
  }
};

// ✅ Get active alerts count
export const getActiveAlertsCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`, getAuthHeader());
    const alerts = response.data.data || [];
    return alerts.length;
  } catch (error) {
    console.error('Error getting alert count:', error);
    return 0;
  }
};

// ✅ Get alert statistics
export const getAlertStats = async () => {
  try {
    const response = await getActiveAlerts();
    const alerts = response.data.alerts || [];
    
    const active = alerts.filter(a => !a.resolved);
    const resolved = alerts.filter(a => a.resolved);
    const lowStock = active.filter(a => a.alertType === 'LOW_STOCK');
    const outOfStock = active.filter(a => a.alertType === 'OUT_OF_STOCK');

    return {
      total: active.length,
      active: active.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      resolved: resolved.length
    };
  } catch (error) {
    console.error('Error getting alert stats:', error);
    return {
      total: 0,
      active: 0,
      lowStock: 0,
      outOfStock: 0,
      resolved: 0
    };
  }
};

// Legacy function for compatibility
export const checkLowStockAlerts = (products) => {
  console.log('Low stock alerts are handled automatically by backend');
};

// Export default for compatibility
export default {
  getAllAlerts,
  getActiveAlerts,
  getRecentAlerts,
  getAlertsByType,
  resolveAlert,
  markAllAsRead,
  deleteAlert,
  getActiveAlertsCount,
  getAlertStats,
  checkLowStockAlerts
};
