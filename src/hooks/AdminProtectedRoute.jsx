import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    // Logged in but not admin → redirect home or elsewhere
    return <Navigate to="/" />;
  }

  // Admin → show the admin page
  return children;
};

export default AdminProtectedRoute;
