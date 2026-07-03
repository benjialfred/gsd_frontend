import React from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useOnboardingStore } from '../../../../stores/useOnboardingStore';
import { TagSelector } from '../../components/TagSelector';
import { useQuery } from '@tanstack/react-query';
import { getReferenceData } from '../../../../services/reference';
import { Loader } from 'lucide-react';

export const PersonalityStep: React.FC = () => {
  const { formData, updateFormData } = useOnboardingStore();
  
  const { data, isLoading } = useQuery({
    queryKey: ['referenceData'],
    queryFn: getReferenceData
  });

  if (isLoading) {
    return (
      <StepContainer 
        stepKey="personality"
        title="Vos centres d'intérêt"
        subtitle="Chargement des options..."
      >
        <div className="flex justify-center py-10">
          <Loader className="animate-spin text-gsd-primary" size={32} />
        </div>
      </StepContainer>
    );
  }

  const interests = data?.interests || [];
  const languages = data?.languages || [];

  return (
    <StepContainer 
      stepKey="personality"
      title="Vos centres d'intérêt"
      subtitle="Qu'aimez-vous faire de votre temps libre ?"
      benefit="Nous utiliserons ces informations pour améliorer vos compatibilités."
    >
      <div className="space-y-8 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Langues parlées</label>
          <TagSelector 
            options={languages}
            selectedIds={formData.languages || []}
            onChange={(ids) => updateFormData({ languages: ids as number[] })}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Centres d'intérêt (Max 5)</label>
          <TagSelector 
            options={interests}
            selectedIds={formData.interests || []}
            maxSelection={5}
            onChange={(ids) => updateFormData({ interests: ids as number[] })}
          />
        </div>
      </div>
    </StepContainer>
  );
};
