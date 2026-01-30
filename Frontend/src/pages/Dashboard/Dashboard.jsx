import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getUserRole } from '../../services/authService';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import StaffDashboard from './StaffDashboard';

function Dashboard() {
  const navigate = useNavigate();
  const userRole = getUserRole();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate, userRole]);

  // Route to appropriate dashboard based on role
  if (userRole === 'ADMIN') {
    return <AdminDashboard />;
  } else if (userRole === 'MANAGER') {
    return <ManagerDashboard />;
  } else if (userRole === 'STAFF') {
    return <StaffDashboard />;
  } else {
    // For any other role or unapproved users, redirect to login
    navigate('/login');
    return null;
  }
}

export default Dashboard;
