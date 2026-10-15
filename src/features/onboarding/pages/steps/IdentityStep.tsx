import React from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useOnboardingStore } from '../../../../stores/useOnboardingStore';

export const IdentityStep: React.FC = () => {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <StepContainer 
      stepKey="identity"
      title="Faisons connaissance"
      subtitle="Ces informations nous permettent de mieux vous comprendre."
      benefit="Un profil complet reçoit 3x plus d'interactions."
    >
      <div className="space-y-10 max-w-md mx-auto w-full mt-4">
        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Vous êtes</label>
          <div className="grid grid-cols-2 gap-4">
            {['M', 'F'].map(gender => (
              <button
                key={gender}
                onClick={() => updateFormData({ gender })}
                className={`py-4 border transition-all ${
                  formData.gender === gender 
                    ? 'border-[#C9A84C] bg-[#fcf9f2] text-[#C9A84C]' 
                    : 'border-gray-200 hover:border-[#1A3A5C] bg-transparent text-gray-500 hover:text-[#1A3A5C]'
                }`}
              >
                <span className="text-sm font-medium tracking-wide uppercase">{gender === 'M' ? 'Un Homme' : 'Une Femme'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Date de naissance</label>
          <input 
            type="date"
            value={formData.birth_date || ''}
            onChange={(e) => updateFormData({ birth_date: e.target.value })}
            className="w-full px-4 py-4 border-b border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-lg text-[#1A3A5C] font-light outline-none"
          />
        </div>
      </div>
    </StepContainer>
  );
};
