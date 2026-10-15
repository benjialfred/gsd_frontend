import React from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useOnboardingStore } from '../../../../stores/useOnboardingStore';

export const SpiritualityStep: React.FC = () => {
  const { formData, updateFormData } = useOnboardingStore();

  return (
    <StepContainer 
      stepKey="spirituality"
      title="Votre foi"
      subtitle="La dimension spirituelle est au cœur de notre plateforme."
      benefit="Cette information est cruciale pour vous proposer des profils partageant vos valeurs."
    >
      <div className="space-y-10 max-w-md mx-auto w-full mt-4">
        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Dénomination</label>
          <select 
            value={formData.denomination || ''}
            onChange={(e) => updateFormData({ denomination: e.target.value })}
            className="w-full px-4 py-4 border-b border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-sm text-[#1A3A5C] font-light outline-none"
          >
            <option value="" disabled>Sélectionnez une dénomination</option>
            <option value="CATHOLIC">Catholique</option>
            <option value="PROTESTANT">Protestant</option>
            <option value="ORTHODOX">Orthodoxe</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>

        <div className="space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#1A3A5C]/80">Fréquence de culte</label>
          <select 
            value={formData.church_attendance || ''}
            onChange={(e) => updateFormData({ church_attendance: e.target.value })}
            className="w-full px-4 py-4 border-b border-gray-200 focus:border-[#C9A84C] focus:ring-0 transition-colors bg-transparent text-sm text-[#1A3A5C] font-light outline-none"
          >
            <option value="" disabled>À quelle fréquence allez-vous à l'église ?</option>
            <option value="WEEKLY">Toutes les semaines</option>
            <option value="MONTHLY">Une fois par mois</option>
            <option value="RARELY">Rarement</option>
          </select>
        </div>
      </div>
    </StepContainer>
  );
};
