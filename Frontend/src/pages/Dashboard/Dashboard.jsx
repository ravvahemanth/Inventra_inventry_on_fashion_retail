import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import StaffDashboard from './StaffDashboard';

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const rawRole = localStorage.getItem('userRole') || 'STAFF';
    const normalizedRole = rawRole.toUpperCase().replace('ROLE_', '');
    setRole(normalizedRole);
    setChecking(false);
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Route to appropriate dashboard based on normalized role
  if (role === 'ADMIN') {
    return <AdminDashboard />;
  } else if (role === 'MANAGER') {
    return <ManagerDashboard />;
  } else {
    // Default all store associates and floor staff to Staff Dashboard
    return <StaffDashboard />;
  }
}

export default Dashboard;
