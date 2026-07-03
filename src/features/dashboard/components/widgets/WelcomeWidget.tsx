import React from 'react';
import { useAuthStore } from '../../../../stores/authStore';

export const WelcomeWidget: React.FC = () => {
  const { user } = useAuthStore();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getSubMessage = () => {
    if (!user?.profile?.onboarding_completed) {
      return 'Bienvenue ! Terminez votre profil pour commencer vos découvertes.';
    }
    if (user?.profile?.kyc_status !== 'APPROVED') {
      return 'Vérifiez votre identité pour débloquer toutes les fonctionnalités.';
    }
    return 'Belle journée de découvertes et de partage.';
  };

  return (
    <div className="pt-4 pb-2">
      <h1 className="text-3xl font-light text-gray-900 tracking-tight">
        {getGreeting()} {user?.first_name || 'Utilisateur'} ✨
      </h1>
      <p className="text-gray-500 mt-2 text-lg">
        {getSubMessage()}
      </p>
    </div>
  );
};
