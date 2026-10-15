import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepContainerProps {
  children: React.ReactNode;
  stepKey: number | string; // Used by Framer Motion to detect changes
  title?: string;
  subtitle?: string;
  benefit?: string;
}

const variants = {
  enter: {
    y: 20,
    opacity: 0,
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    y: -20,
    opacity: 0,
  },
};

export const StepContainer: React.FC<StepContainerProps> = ({ children, stepKey, title, subtitle, benefit }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          y: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.3 },
        }}
        className="w-full max-w-2xl mx-auto px-6 py-8 flex flex-col min-h-[60vh]"
      >
        {title && (
          <h2 className="text-4xl font-serif text-[#1A3A5C] mb-3 tracking-wide">
            {title}
          </h2>
        )}
        
        {subtitle && (
          <p className="text-gray-500 mb-8 text-sm font-light leading-relaxed">
            {subtitle}
          </p>
        )}

        {benefit && (
          <div className="mb-8 p-4 bg-[#fcf9f2] border border-[#C9A84C]/20 flex items-start gap-3">
            <span className="text-[#C9A84C] mt-0.5 text-lg">✦</span>
            <p className="text-xs text-[#1A3A5C]/80 font-normal leading-relaxed uppercase tracking-wider">
              {benefit}
            </p>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
