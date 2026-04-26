import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    // Si l'utilisateur n'a pas de token actif, redirection forcée vers le portail de connexion
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
