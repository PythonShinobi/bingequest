// client/src/components/ProtectedProfileRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedProfileRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // If user is NOT authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children; // If authenticated, render the children (Profile component)
};

export default ProtectedProfileRoute;