import React from 'react';
import { StepContainer } from '../../components/StepContainer';

export const KYCPromptStep: React.FC = () => {
  return (
    <StepContainer 
      stepKey="kycprompt"
      title="Devenez Membre Certifié"
      subtitle="Garantissez l'authenticité de votre profil."
      benefit="Les profils certifiés inspirent davantage confiance et reçoivent 4x plus d'interactions."
    >
      <div className="flex flex-col items-center text-center space-y-8 py-4 max-w-md mx-auto w-full">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200">
          <span className="text-3xl">🛡️</span>
        </div>

        <div className="space-y-4 text-left w-full">
          <p className="text-sm text-gray-600 leading-relaxed text-center">
            Notre communauté repose sur la confiance. La certification permet de garantir que chaque profil appartient à une personne réelle.
          </p>
          
          <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#E8ECE9] flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-gray-100 shadow-sm">
              <span className="text-[#8C9B90]">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">Pièce d'identité</h4>
              <p className="text-xs text-gray-500 mt-1">Photo recto/verso de votre CNI ou passeport.</p>
            </div>
          </div>

          <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#E8ECE9] flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-gray-100 shadow-sm">
              <span className="text-[#8C9B90]">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">Vidéo Selfie</h4>
              <p className="text-xs text-gray-500 mt-1">Une courte vidéo pour confirmer votre identité.</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Vos données sont cryptées et supprimées de nos serveurs de vérification après validation.
        </p>
      </div>
    </StepContainer>
  );
};
