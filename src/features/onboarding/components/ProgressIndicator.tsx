import React from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps, completionPercentage }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-[#FDFBF7]/90 backdrop-blur-md sticky top-0 z-50 pt-6 pb-4 px-6 border-b border-[#C9A84C]/20">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Texts */}
        <div className="flex justify-between items-end">
          <div className="text-[10px] font-semibold text-[#1A3A5C] uppercase tracking-[0.2em] flex items-center gap-6">
            <span>Étape {currentStep} / {totalSteps}</span>
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent('open-save-exit'))}
              className="text-[#C9A84C] hover:text-[#1A3A5C] transition-colors border-b border-transparent hover:border-[#1A3A5C] pb-0.5"
            >
              Sauvegarder et quitter
            </button>
          </div>
          <div className="text-[10px] font-serif text-[#1A3A5C] uppercase tracking-widest flex items-center gap-2">
            <span className="text-[#C9A84C]">✦</span> Profil complété à {completionPercentage}%
          </div>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-1 w-full bg-gray-200 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-[#1A3A5C]"
          />
        </div>
      </div>
    </div>
  );
};
