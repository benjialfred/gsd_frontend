import React from 'react';
import { StepContainer } from '../../components/StepContainer';

export const WelcomeStep: React.FC = () => {
  return (
    <StepContainer 
      stepKey="welcome"
      title="Bienvenue au Grand Salon Divin"
      subtitle="La plateforme d'excellence pour des rencontres authentiques et spirituelles."
    >
      <div className="flex flex-col items-center text-center space-y-8 py-8 mt-4">
        <div className="w-48 h-auto mb-6">
          <img src="/logo.png" alt="Grand Salon Divin Logo" className="w-full h-auto object-contain" />
        </div>
        <p className="text-sm font-light text-[#1A3A5C]/80 max-w-md mx-auto leading-relaxed font-sans">
          Nous allons créer ensemble un profil qui reflète vos valeurs et votre vision. Ce processus prendra moins de 3 minutes.
        </p>
      </div>
    </StepContainer>
  );
};
