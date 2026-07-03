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
    <div className="w-full bg-white bg-opacity-70 backdrop-blur-md sticky top-0 z-50 pt-6 pb-4 px-6 border-b border-gray-100">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        {/* Texts */}
        <div className="flex justify-between items-end">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center gap-4">
            <span>Étape {currentStep} sur {totalSteps}</span>
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent('open-save-exit'))}
              className="text-xs text-[#8C9B90] hover:text-gray-900 transition-colors"
            >
              Sauvegarder et quitter
            </button>
          </div>
          <div className="text-sm font-semibold text-[#8C9B90]">
            Profil complété à {completionPercentage}%
          </div>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#C2C9C4] to-[#8C9B90] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
