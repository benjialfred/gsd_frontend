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
      <div className="space-y-10 max-w-md mx-auto w-full mt-4">
        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Profession</label>
          <input 
            type="text"
            placeholder="Ex: Ingénieur, Enseignant..."
            value={formData.profession || ''}
            onChange={(e) => updateFormData({ profession: e.target.value })}
            className="w-full px-4 py-4 border-b border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-lg text-[#1A3A5C] font-light outline-none placeholder:text-gray-300"
          />
        </div>

        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Niveau d'études</label>
          <select 
            value={formData.education_level || ''}
            onChange={(e) => updateFormData({ education_level: e.target.value })}
            className="w-full px-4 py-4 border-b border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-sm text-[#1A3A5C] font-light outline-none"
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
