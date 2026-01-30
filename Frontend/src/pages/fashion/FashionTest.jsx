import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../services/authService';

function FashionTest() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');

    setDebugInfo({
      token: token ? 'Present' : 'Missing',
      userEmail: userEmail || 'Not found',
      username: username || 'Not found',
      role: role || 'Not found',
      userRoleFromService: userRole || 'Not found'
    });
  }, [userRole]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Fashion Page Debug Info</h1>
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
        <h3>Authentication Status:</h3>
        <ul>
          <li>Token: {debugInfo.token}</li>
          <li>User Email: {debugInfo.userEmail}</li>
          <li>Username: {debugInfo.username}</li>
          <li>Role (localStorage): {debugInfo.role}</li>
          <li>Role (service): {debugInfo.userRoleFromService}</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/login')} style={{ marginRight: '10px', padding: '10px 20px' }}>
          Go to Login
        </button>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px' }}>
          Go to Dashboard
        </button>
      </div>
      
      <div style={{ marginTop: '20px', background: '#e8f4fd', padding: '15px', borderRadius: '8px' }}>
        <h3>Instructions:</h3>
        <p>If you see "Missing" for token, you need to login first.</p>
        <p>If authentication is working, we can proceed to fix the Fashion Products page.</p>
      </div>
    </div>
  );
}

export default FashionTest;