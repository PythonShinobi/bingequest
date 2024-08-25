// client/src/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './authContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated() ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;