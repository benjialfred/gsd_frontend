import React from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useProfileCompletion } from '../../../../hooks/useProfile';
import { motion } from 'framer-motion';

export const SummaryStep: React.FC = () => {
  const { data } = useProfileCompletion();
  const completion = data?.completion_percentage || 0;

  return (
    <StepContainer 
      stepKey="summary"
      title="Profil Débloqué ! 🎉"
      subtitle="Vous avez posé des fondations solides pour de belles rencontres."
    >
      <div className="flex flex-col items-center text-center space-y-8 py-4 max-w-md mx-auto w-full">
        <div className="relative w-48 h-48">
          {/* Circular Progress Indicator */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#F5F7F5"
              strokeWidth="10"
            />
            <motion.circle
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * completion) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#8C9B90"
              strokeWidth="10"
              strokeDasharray="283"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-light text-gray-900">{completion}%</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Complété</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8ECE9] w-full text-left shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Avantages débloqués :</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <span className="text-[#8C9B90]">✓</span> Matching actif avec les autres membres
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <span className="text-[#8C9B90]">✓</span> Visibilité accrue dans la section Découverte
            </li>
          </ul>
        </div>
      </div>
    </StepContainer>
  );
};
