import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function ProtectedRoute() {
  const { token, user } = useAuthStore();
  const location = useLocation();

  if (!token) {
    // Si l'utilisateur n'a pas de token actif, redirection forcée vers le portail de connexion
    return <Navigate to="/login" replace />;
  }

  // Vérification de l'onboarding complet
  const isOnboardingCompleted = user?.profile?.onboarding_completed;
  
  if (user && !isOnboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Si l'utilisateur a fini l'onboarding, il ne doit plus y avoir accès
  if (user && isOnboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
