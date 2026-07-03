import React from 'react';
import { StepContainer } from '../../components/StepContainer';

export const WelcomeStep: React.FC = () => {
  return (
    <StepContainer 
      stepKey="welcome"
      title="Bienvenue au Grand Salon Divin"
      subtitle="La plateforme d'excellence pour des rencontres authentiques et spirituelles."
    >
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="w-24 h-24 bg-[#F5F7F5] rounded-full flex items-center justify-center mb-4 border border-[#E8ECE9]">
          <span className="text-4xl">✨</span>
        </div>
        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          Nous allons créer ensemble un profil qui reflète vos valeurs et votre vision. Ce processus prendra moins de 3 minutes.
        </p>
      </div>
    </StepContainer>
  );
};
