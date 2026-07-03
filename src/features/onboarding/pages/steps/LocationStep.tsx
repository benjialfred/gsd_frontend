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
      <div className="space-y-8 max-w-md mx-auto w-full">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Ville</label>
          <input 
            type="text"
            placeholder="Ex: Paris, France"
            value={formData.city || ''}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#8C9B90] focus:ring-0 transition-colors bg-white"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Confidentialité</label>
          <select 
            value={formData.location_visibility || 'CITY_ONLY'}
            onChange={(e) => updateFormData({ location_visibility: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#8C9B90] focus:ring-0 transition-colors bg-white"
          >
            <option value="CITY_ONLY">Afficher uniquement la ville (Recommandé)</option>
            <option value="HIDDEN">Masquer ma localisation</option>
          </select>
        </div>
      </div>
    </StepContainer>
  );
};
