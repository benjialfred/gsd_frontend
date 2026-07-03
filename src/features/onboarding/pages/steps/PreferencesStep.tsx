import React from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useOnboardingStore } from '../../../../stores/useOnboardingStore';

export const PreferencesStep: React.FC = () => {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <StepContainer 
      stepKey="preferences"
      title="Vos Préférences"
      subtitle="Qui aimeriez-vous rencontrer ?"
      benefit="Nos algorithmes respecteront ces critères stricts pour vous proposer des profils pertinents."
    >
      <div className="space-y-8 max-w-md mx-auto w-full">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Tranche d'âge</label>
          <div className="flex gap-4 items-center">
            <input 
              type="number"
              placeholder="Min"
              min="18"
              max="99"
              value={formData.preferred_age_min || ''}
              onChange={(e) => updateFormData({ preferred_age_min: parseInt(e.target.value) })}
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#8C9B90] focus:ring-0 transition-colors bg-white"
            />
            <span className="text-gray-400">à</span>
            <input 
              type="number"
              placeholder="Max"
              min="18"
              max="99"
              value={formData.preferred_age_max || ''}
              onChange={(e) => updateFormData({ preferred_age_max: parseInt(e.target.value) })}
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#8C9B90] focus:ring-0 transition-colors bg-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Distance maximale (km)</label>
          <input 
            type="range"
            min="5"
            max="500"
            step="5"
            value={formData.preferred_distance || 50}
            onChange={(e) => updateFormData({ preferred_distance: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8C9B90]"
          />
          <div className="text-right text-sm text-[#8C9B90] font-medium">
            {formData.preferred_distance || 50} km
          </div>
        </div>
      </div>
    </StepContainer>
  );
};
