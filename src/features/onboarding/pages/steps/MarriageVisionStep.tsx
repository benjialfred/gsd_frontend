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
      <div className="space-y-8 max-w-md mx-auto w-full">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Vos objectifs (Optionnel)</label>
          <textarea 
            placeholder="Ex: Fonder une famille, grandir ensemble spirituellement..."
            value={formData.marriage_objectives || ''}
            onChange={(e) => updateFormData({ marriage_objectives: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#8C9B90] focus:ring-0 transition-colors bg-white min-h-[120px] resize-none"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Vos attentes envers votre partenaire (Optionnel)</label>
          <textarea 
            placeholder="Qu'attendez-vous de la personne qui partagera votre vie ?"
            value={formData.marriage_expectations || ''}
            onChange={(e) => updateFormData({ marriage_expectations: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#8C9B90] focus:ring-0 transition-colors bg-white min-h-[120px] resize-none"
          />
        </div>
      </div>
    </StepContainer>
  );
};
