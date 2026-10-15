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
      <div className="flex flex-col items-center text-center space-y-12 py-4 max-w-md mx-auto w-full mt-4">
        <div className="relative w-48 h-48">
          {/* Circular Progress Indicator */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#fcf9f2"
              strokeWidth="6"
            />
            <motion.circle
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * completion) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="6"
              strokeDasharray="283"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-serif text-[#1A3A5C]">{completion}%</span>
            <span className="text-[10px] text-[#1A3A5C]/50 uppercase tracking-[0.2em] mt-2">Complété</span>
          </div>
        </div>

        <div className="w-full text-left bg-white p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A84C]"></div>
          <h3 className="font-serif text-xl text-[#1A3A5C] mb-6">Avantages débloqués</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-sm text-[#1A3A5C]/80 font-light">
              <span className="text-[#C9A84C] text-lg">✦</span> Matching actif avec les autres membres
            </li>
            <li className="flex items-center gap-4 text-sm text-[#1A3A5C]/80 font-light">
              <span className="text-[#C9A84C] text-lg">✦</span> Visibilité accrue dans la section Découverte
            </li>
          </ul>
        </div>
      </div>
    </StepContainer>
  );
};
