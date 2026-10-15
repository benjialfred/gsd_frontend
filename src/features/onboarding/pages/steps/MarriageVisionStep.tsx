import React from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useOnboardingStore } from '../../../../stores/useOnboardingStore';

export const MarriageVisionStep: React.FC = () => {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <StepContainer 
      stepKey="marriage"
      title="Vision du Mariage"
      subtitle="Partagez vos attentes pour votre futur foyer."
      benefit="Un profil transparent attire des partenaires véritablement alignés avec votre vision."
    >
      <div className="space-y-10 max-w-md mx-auto w-full mt-4">
        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Vos objectifs (Optionnel)</label>
          <textarea 
            placeholder="Ex: Fonder une famille, grandir ensemble spirituellement..."
            value={formData.marriage_objectives || ''}
            onChange={(e) => updateFormData({ marriage_objectives: e.target.value })}
            className="w-full px-4 py-4 border border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-sm text-[#1A3A5C] font-light outline-none min-h-[120px] resize-none"
          />
        </div>

        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Vos attentes envers votre partenaire (Optionnel)</label>
          <textarea 
            placeholder="Qu'attendez-vous de la personne qui partagera votre vie ?"
            value={formData.marriage_expectations || ''}
            onChange={(e) => updateFormData({ marriage_expectations: e.target.value })}
            className="w-full px-4 py-4 border border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-sm text-[#1A3A5C] font-light outline-none min-h-[120px] resize-none"
          />
        </div>
      </div>
    </StepContainer>
  );
};
