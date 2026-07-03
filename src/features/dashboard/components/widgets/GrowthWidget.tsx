import React from 'react';
import { useProfileCompletion } from '../../../../hooks/useProfile';
import { motion } from 'framer-motion';

export const GrowthWidget: React.FC = () => {
  const { data: completionData } = useProfileCompletion();
  const completion = completionData?.completion_percentage || 0;
  const nextAction = completionData?.next_action;
  
  return (
    <div className="bg-[#F5F7F5] rounded-3xl p-8 border border-[#E8ECE9] h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🌱</span>
        <h2 className="text-lg font-medium text-gray-900">Votre parcours</h2>
      </div>

      <div className="flex items-center gap-8 mb-8">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E8ECE9" strokeWidth="8" />
            <motion.circle
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * completion) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="50" cy="50" r="45" fill="none" stroke="#8C9B90" strokeWidth="8"
              strokeDasharray="283" strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-medium text-gray-900">{completion}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8C9B90]"></div>
            <span className="text-sm text-gray-600">Profil complété : <strong>{completion}%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <span className="text-sm text-gray-600">Certification : <strong>En attente</strong></span>
          </div>
        </div>
      </div>

      {nextAction && (
        <div className="mt-auto bg-white/60 p-4 rounded-xl border border-white/40">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Étape suivante</p>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-900">{nextAction}</p>
            <button className="text-[#8C9B90] hover:text-gray-900 transition-colors font-medium text-sm">
              Ajouter &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
