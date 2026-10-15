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
    <div className="w-full max-w-2xl mx-auto px-6 py-6 mt-8 flex justify-between items-center bg-[#FDFBF7]">
      {/* Previous Button */}
      {showPrev ? (
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex items-center justify-center w-12 h-12 border border-[#1A3A5C]/20 text-[#1A3A5C] hover:bg-[#1A3A5C]/5 hover:text-[#C9A84C] transition-colors disabled:opacity-50"
          aria-label="Retour"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
      ) : (
        <div className="w-12 h-12" /> // Placeholder for spacing
      )}

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={isNextDisabled || isSubmitting}
        className="flex items-center justify-center gap-3 px-8 h-14 bg-[#1A3A5C] text-white font-semibold text-xs tracking-[0.2em] uppercase hover:bg-[#152e4a] transition-all disabled:opacity-50 shadow-sm active:scale-95"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-[#C9A84C] rounded-full animate-spin" />
        ) : (
          <>
            {nextLabel}
            {isFinalStep ? <Check size={16} strokeWidth={1.5} /> : <ArrowRight size={16} strokeWidth={1.5} />}
          </>
        )}
      </button>
    </div>
  );
};
