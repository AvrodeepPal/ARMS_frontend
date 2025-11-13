import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { auth } = useAuth();
  
  if (!auth.token) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};
