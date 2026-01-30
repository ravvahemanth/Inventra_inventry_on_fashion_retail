import axiosInstance from '../utils/axiosConfig';

// ✅ FIXED: No need for API_URL since axiosInstance already has baseURL
// Just use relative paths from the base URL

// Get all transactions
export const getAllTransactions = async () => {
  try {
    console.log('🔄 Fetching stock transactions...');
    console.log('🔑 Current user role:', localStorage.getItem('userRole'));
    console.log('👤 Current user email:', localStorage.getItem('userEmail'));
    
    // ✅ FIXED: Use relative path, not full URL
    const response = await axiosInstance.get('/stock-transactions');
    console.log('✅ Raw response:', response.data);
    
    const transactions = (response.data || []).map(txn => ({
      transactionId: txn.id,
      action: txn.type,
      entityName: txn.productName || 'Unknown Product',
      productName: txn.productName,
      details: `${txn.type === 'STOCK_IN' ? 'Added' : 'Removed'} ${txn.quantity} units${txn.reason ? ' - ' + txn.reason : ''}`,
      timestamp: txn.createdAt,
      createdAt: txn.createdAt,
      userId: txn.username || 'Unknown User',
      username: txn.username,
      user: {
        username: txn.username,
        email: txn.username // Using username as fallback since we don't have email in response
      },
      product: {
        name: txn.productName,
        id: txn.productId
      },
      type: txn.type,
      quantity: txn.quantity,
      reason: txn.reason,
      notes: txn.reason,
      oldValue: null,
      newValue: null
    }));

    console.log('✅ Transformed transactions:', transactions.length, 'items');

    return {
      data: transactions // Return direct array
    };
  } catch (error) {
    console.error('❌ Error fetching all transactions:', error);
    console.error('❌ Error details:', error.response?.data);
    return { data: [] };
  }
};

// Get transactions by type
export const getTransactionsByType = async (type) => {
  try {
    const backendType = type.toUpperCase();
    const allResponse = await axiosInstance.get('/stock-transactions');
    const allTransactions = allResponse.data || [];
    
    const filtered = allTransactions.filter(txn => txn.type === backendType);
    
    const transactions = filtered.map(txn => ({
      transactionId: txn.id,
      action: txn.type,
      entityName: txn.productName || 'Unknown Product',
      productName: txn.productName,
      details: `${txn.type === 'STOCK_IN' ? 'Added' : 'Removed'} ${txn.quantity} units${txn.reason ? ' - ' + txn.reason : ''}`,
      timestamp: txn.createdAt,
      createdAt: txn.createdAt,
      userId: txn.username || 'Unknown User',
      username: txn.username,
      user: {
        username: txn.username,
        email: txn.username
      },
      product: {
        name: txn.productName,
        id: txn.productId
      },
      type: txn.type,
      quantity: txn.quantity,
      reason: txn.reason,
      notes: txn.reason
    }));

    return {
      data: transactions
    };
  } catch (error) {
    console.error(`❌ Error fetching ${type} transactions:`, error);
    return { data: [] };
  }
};

// Export to CSV (Admin and Manager)
export const exportTransactionsCSV = async () => {
  try {
    console.log('🔧 Starting CSV export from backend...');
    console.log('🔑 User role:', localStorage.getItem('userRole'));

    // Try stock-transactions endpoint first (for managers), then admin endpoint
    let response;
    try {
      console.log('📋 Trying manager endpoint: /stock-transactions/export');
      response = await axiosInstance.get('/stock-transactions/export', {
        responseType: 'blob'
      });
      console.log('✅ Manager endpoint successful');
    } catch (error) {
      console.log('❌ Manager endpoint failed, trying admin endpoint');
      // Fallback to admin endpoint if manager endpoint fails
      response = await axiosInstance.get('/admin/transactions/export', {
        responseType: 'blob'
      });
      console.log('✅ Admin endpoint successful');
    }

    console.log('✅ CSV data received from backend, size:', response.data.size);

    // Create blob and download
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log('✅ CSV exported successfully');
    return { success: true, message: 'Transactions exported to CSV successfully!' };
  } catch (error) {
    console.error('❌ Error exporting CSV:', error);
    console.error('❌ Error response:', error.response?.data);
    throw new Error('Failed to export CSV: ' + (error.response?.data?.message || error.message));
  }
};

// Get action info
export const getActionInfo = (action) => {
  switch (action) {
    case 'STOCK_IN':
    case 'IN':
      return {
        icon: '📥',
        label: 'Stock In',
        color: 'green',
        description: 'Stock added to inventory'
      };
    case 'STOCK_OUT':
    case 'OUT':
      return {
        icon: '📤',
        label: 'Stock Out',
        color: 'red',
        description: 'Stock removed from inventory'
      };
    default:
      return {
        icon: '📝',
        label: action || 'Transaction',
        color: 'blue',
        description: 'Transaction'
      };
  }
};

export default {
  getAllTransactions,
  getTransactionsByType,
  exportTransactionsCSV,
  getActionInfo
};
