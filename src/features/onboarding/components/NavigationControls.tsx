import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface NavigationControlsProps {
  onNext: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
  showPrev?: boolean;
  isFinalStep?: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onNext,
  onPrev,
  isNextDisabled = false,
  isSubmitting = false,
  nextLabel = "Continuer",
  showPrev = true,
  isFinalStep = false,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-6 mt-8 flex justify-between items-center bg-white">
      {/* Previous Button */}
      {showPrev ? (
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-50"
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
        </button>
      ) : (
        <div className="w-12 h-12" /> // Placeholder for spacing
      )}

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={isNextDisabled || isSubmitting}
        className="flex items-center justify-center gap-2 px-8 h-12 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {nextLabel}
            {isFinalStep ? <Check size={18} /> : <ArrowRight size={18} />}
          </>
        )}
      </button>
    </div>
  );
};
