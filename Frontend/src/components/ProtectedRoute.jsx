import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/login" replace />;
  }
  
  // Check role-based access if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
