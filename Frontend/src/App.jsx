import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import FashionProducts from './pages/fashion/FashionProducts';
import FashionProductDetail from './pages/fashion/FashionProductDetail';
import FashionProductManagement from './pages/admin/FashionProductManagement';
import FashionStockManagement from './pages/admin/FashionStockManagement';
import AdminAlerts from './pages/admin/AdminAlerts';
import AdminTransactions from './pages/admin/AdminTransactions';
import UserManagement from './pages/admin/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Executive Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fashion Retail Catalog Routes */}
        <Route
          path="/fashion"
          element={
            <ProtectedRoute>
              <FashionProducts />
            </ProtectedRoute>
          }
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
          path="/products"
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

        {/* Admin Product Operations */}
        <Route
          path="/admin/fashion/add"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <FashionProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fashion/add-product"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <FashionProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fashion/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <FashionProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <FashionProductManagement />
            </ProtectedRoute>
          }
        />

        {/* Stock Management & Floor Ledger */}
        <Route
          path="/admin/fashion-stock"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}>
              <FashionStockManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/stock"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}>
              <FashionStockManagement />
            </ProtectedRoute>
          }
        />

        {/* Risk & Sentinel Alerts */}
        <Route
          path="/alerts"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <AdminAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <AdminAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/alerts"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <AdminAlerts />
            </ProtectedRoute>
          }
        />

        {/* Transactions & Audit Trails */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}>
              <AdminTransactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}>
              <AdminTransactions />
            </ProtectedRoute>
          }
        />

        {/* User Administration */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/fashion" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
