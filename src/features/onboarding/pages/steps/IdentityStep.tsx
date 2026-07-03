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
      <div className="space-y-8 max-w-md mx-auto w-full">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Vous êtes</label>
          <div className="grid grid-cols-2 gap-4">
            {['M', 'F'].map(gender => (
              <button
                key={gender}
                onClick={() => updateFormData({ gender })}
                className={`py-4 rounded-xl border-2 transition-all ${
                  formData.gender === gender 
                    ? 'border-[#8C9B90] bg-[#F5F7F5] text-[#8C9B90]' 
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <span className="text-lg font-medium">{gender === 'M' ? 'Un Homme' : 'Une Femme'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
          <input 
            type="date"
            value={formData.birth_date || ''}
            onChange={(e) => updateFormData({ birth_date: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#8C9B90] focus:ring-0 transition-colors bg-white"
          />
        </div>
      </div>
    </StepContainer>
  );
};
