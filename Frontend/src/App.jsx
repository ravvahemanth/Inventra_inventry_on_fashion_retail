import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/products/Products';
import Alerts from './pages/alerts/Alerts';
import Transactions from './pages/transactions/Transactions';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import AdminAlerts from './pages/admin/AdminAlerts';
import StockManagement from './pages/manager/StockManagement';
import ManagerAlerts from './pages/manager/ManagerAlerts';
import ProtectedRoute from './components/ProtectedRoute';
import AdminTransactions from './pages/admin/AdminTransactions';

// Fashion Retail Components
import FashionProducts from './pages/fashion/FashionProducts';
import FashionProductDetail from './pages/fashion/FashionProductDetail';
import FashionTest from './pages/fashion/FashionTest';
import FashionProductManagement from './pages/admin/FashionProductManagement';
import FashionStockManagement from './pages/admin/FashionStockManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fashion Retail Routes */}
        <Route 
          path="/fashion" 
          element={
            <ProtectedRoute>
              <FashionProducts />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/fashion/product/:id" 
          element={
            <ProtectedRoute>
              <FashionProductDetail />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/fashion/test" 
          element={<FashionTest />} 
        />
        
        <Route 
          path="/fashion/products" 
          element={
            <ProtectedRoute>
              <FashionProducts />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/fashion/add" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <FashionProductManagement />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/fashion/add-product" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <FashionProductManagement />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/fashion-stock" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <FashionStockManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy Product Routes (for backward compatibility) */}
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/alerts" 
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/alerts" 
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/manager/alerts" 
          element={
            <ProtectedRoute>
              <ManagerAlerts />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/transactions" 
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute>
              <ProductManagement />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/alerts" 
          element={
            <ProtectedRoute>
              <AdminAlerts />
            </ProtectedRoute>
          } 
        />

        {/* Manager Routes */}
        <Route 
          path="/manager/stock" 
          element={
            <ProtectedRoute>
              <StockManagement />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/manager/alerts" 
          element={
            <ProtectedRoute>
              <ManagerAlerts />
            </ProtectedRoute>
          } 
        />
        
        {/* Default Route - Redirect to Fashion Products */}
        <Route path="/" element={<Navigate to="/fashion" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
