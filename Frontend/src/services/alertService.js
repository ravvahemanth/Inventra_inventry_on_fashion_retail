import axiosInstance from '../utils/axiosConfig';

// Get all alerts
export const getAllAlerts = async () => {
  try {
    const response = await axiosInstance.get('/alerts');
    return {
      data: {
        alerts: response.data.data || []
      }
    };
  } catch (error) {
    if (error.response?.status === 403) {
      return { 
        data: { alerts: [] },
        error: 'Access denied: Insufficient permissions to view alerts'
      };
    }
    return { data: { alerts: [] } };
  }
};

// Get active alerts only
export const getActiveAlerts = async () => {
  try {
    const response = await axiosInstance.get('/alerts/active');
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
    if (error.response?.status === 403) {
      return { 
        data: { alerts: [] },
        error: 'Access denied: Insufficient permissions to view alerts'
      };
    }
    return { data: { alerts: [] } };
  }
};

// Get recent alerts (top 10)
export const getRecentAlerts = async () => {
  try {
    const response = await axiosInstance.get('/alerts/recent');
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
    return { data: { alerts: [] } };
  }
};

// Get alerts by type (LOW_STOCK or OUT_OF_STOCK)
export const getAlertsByType = async (type) => {
  try {
    const response = await axiosInstance.get(`/alerts/type/${type.toUpperCase()}`);
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
    return { data: { alerts: [] } };
  }
};

// Resolve alert
export const resolveAlert = async (id) => {
  try {
    const response = await axiosInstance.put(`/alerts/${id}/resolve`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Mark all alerts as resolved
export const markAllAsRead = async () => {
  try {
    const response = await axiosInstance.put('/alerts/mark-all-resolved');
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete alert (Admin only)
export const deleteAlert = async (id) => {
  try {
    const response = await axiosInstance.delete(`/alerts/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get active alerts count
export const getActiveAlertsCount = async () => {
  try {
    const response = await axiosInstance.get('/alerts/active');
    const alerts = response.data.data || [];
    return alerts.length;
  } catch (error) {
    return 0;
  }
};

// Get alert statistics
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
    return {
      total: 0,
      active: 0,
      lowStock: 0,
      outOfStock: 0,
      resolved: 0
    };
  }
};

export default {
  getAllAlerts,
  getActiveAlerts,
  getRecentAlerts,
  getAlertsByType,
  resolveAlert,
  markAllAsRead,
  deleteAlert,
  getActiveAlertsCount,
  getAlertStats
};
