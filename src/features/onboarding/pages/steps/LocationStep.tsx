import React from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useOnboardingStore } from '../../../../stores/useOnboardingStore';

export const LocationStep: React.FC = () => {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <StepContainer 
      stepKey="location"
      title="Où vous trouvez-vous ?"
      subtitle="Nous utilisons cette information pour le matchmaking."
      benefit="Vos coordonnées exactes ne seront jamais partagées. Vous pouvez choisir d'afficher uniquement votre ville."
    >
      <div className="space-y-10 max-w-md mx-auto w-full mt-4">
        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Ville</label>
          <input 
            type="text"
            placeholder="Ex: Paris, France"
            value={formData.city || ''}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className="w-full px-4 py-4 border-b border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-lg text-[#1A3A5C] font-light outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Confidentialité</label>
          <select 
            value={formData.location_visibility || 'CITY_ONLY'}
            onChange={(e) => updateFormData({ location_visibility: e.target.value })}
            className="w-full px-4 py-4 border-b border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-sm text-[#1A3A5C] font-light outline-none"
          >
            <option value="CITY_ONLY">Afficher uniquement la ville (Recommandé)</option>
            <option value="HIDDEN">Masquer ma localisation</option>
          </select>
        </div>
      </div>
    </StepContainer>
  );
};
