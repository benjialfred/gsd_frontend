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
      <div className="space-y-10 max-w-md mx-auto w-full mt-4">
        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Tranche d'âge</label>
          <div className="flex gap-4 items-center">
            <input 
              type="number"
              placeholder="Min"
              min="21"
              max="99"
              value={formData.pref_age_min || ''}
              onChange={(e) => updateFormData({ pref_age_min: parseInt(e.target.value) })}
              className="w-full px-4 py-4 border-b border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-lg text-[#1A3A5C] font-light outline-none text-center"
            />
            <span className="text-gray-300 font-serif italic text-xl">à</span>
            <input 
              type="number"
              placeholder="Max"
              min="21"
              max="99"
              value={formData.pref_age_max || ''}
              onChange={(e) => updateFormData({ pref_age_max: parseInt(e.target.value) })}
              className="w-full px-4 py-4 border-b border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-lg text-[#1A3A5C] font-light outline-none text-center"
            />
          </div>
        </div>

        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Distance maximale (km)</label>
          <input 
            type="range"
            min="5"
            max="500"
            step="5"
            value={formData.pref_distance || 50}
            onChange={(e) => updateFormData({ pref_distance: parseInt(e.target.value) })}
            className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-[#1A3A5C]"
          />
          <div className="text-right text-sm text-[#C9A84C] font-serif tracking-widest">
            {formData.pref_distance || 50} KM
          </div>
        </div>
      </div>
    </StepContainer>
  );
};
