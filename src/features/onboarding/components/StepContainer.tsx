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
          <h2 className="text-3xl font-light text-gray-900 mb-2 tracking-tight">
            {title}
          </h2>
        )}
        
        {subtitle && (
          <p className="text-gray-500 mb-6 text-lg">
            {subtitle}
          </p>
        )}

        {benefit && (
          <div className="mb-8 p-4 bg-[#F5F7F5] border border-[#E8ECE9] rounded-xl flex items-start gap-3">
            <span className="text-[#8C9B90] mt-0.5">✨</span>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
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
