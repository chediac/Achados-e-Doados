import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUser } from '../lib/auth';

export function ProtectedRoute({ children, allowedTipo }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific user type is required, validate it
  if (allowedTipo) {
    const user = getUser();
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    const allowed = Array.isArray(allowedTipo) ? allowedTipo : [allowedTipo];
    if (!allowed.includes(user.tipo)) {
      // not authorized for this role -> redirect to home
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
