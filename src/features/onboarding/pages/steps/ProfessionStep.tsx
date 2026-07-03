import React from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useOnboardingStore } from '../../../../stores/useOnboardingStore';

export const ProfessionStep: React.FC = () => {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <StepContainer 
      stepKey="profession"
      title="Votre parcours"
      subtitle="Parlez-nous de votre situation professionnelle."
      benefit="Les profils indiquant leur profession reçoivent plus de messages de qualité."
    >
      <div className="space-y-8 max-w-md mx-auto w-full">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Profession</label>
          <input 
            type="text"
            placeholder="Ex: Ingénieur, Enseignant..."
            value={formData.profession || ''}
            onChange={(e) => updateFormData({ profession: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#8C9B90] focus:ring-0 transition-colors bg-white"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Niveau d'études</label>
          <select 
            value={formData.education_level || ''}
            onChange={(e) => updateFormData({ education_level: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#8C9B90] focus:ring-0 transition-colors bg-white"
          >
            <option value="" disabled>Sélectionnez un niveau</option>
            <option value="HIGH_SCHOOL">Lycée</option>
            <option value="BACHELOR">Licence / Bachelor</option>
            <option value="MASTER">Master</option>
            <option value="PHD">Doctorat</option>
          </select>
        </div>
      </div>
    </StepContainer>
  );
};
