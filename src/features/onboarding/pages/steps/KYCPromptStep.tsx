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
      <div className="flex flex-col items-center text-center space-y-10 py-4 max-w-md mx-auto w-full mt-4">
        <div className="w-20 h-20 bg-[#fcf9f2] rounded-full flex items-center justify-center border border-[#C9A84C]/30">
          <span className="text-3xl text-[#C9A84C]">🛡️</span>
        </div>

        <div className="space-y-6 text-left w-full">
          <p className="text-sm text-[#1A3A5C]/70 font-light leading-relaxed text-center italic font-serif">
            "Notre communauté repose sur la confiance. La certification garantit l'authenticité de chaque rencontre."
          </p>
          
          <div className="bg-white p-5 border border-gray-100 shadow-sm flex items-start gap-5 hover:border-[#C9A84C]/50 transition-colors">
            <div className="w-8 h-8 bg-[#1A3A5C] text-white flex items-center justify-center flex-shrink-0 font-serif text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold tracking-wider uppercase text-[#1A3A5C] text-[10px]">Pièce d'identité</h4>
              <p className="text-xs text-gray-500 mt-2 font-light">Photo recto/verso de votre CNI ou passeport.</p>
            </div>
          </div>

          <div className="bg-white p-5 border border-gray-100 shadow-sm flex items-start gap-5 hover:border-[#C9A84C]/50 transition-colors">
            <div className="w-8 h-8 bg-[#1A3A5C] text-white flex items-center justify-center flex-shrink-0 font-serif text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold tracking-wider uppercase text-[#1A3A5C] text-[10px]">Vidéo Selfie</h4>
              <p className="text-xs text-gray-500 mt-2 font-light">Une courte vidéo pour confirmer votre identité.</p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">
          Vos données sont cryptées et supprimées après validation.
        </p>
      </div>
    </StepContainer>
  );
};
