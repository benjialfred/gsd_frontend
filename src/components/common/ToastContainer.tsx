import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, type ToastType } from '../../stores/useToastStore';

const ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: 'bg-[#102A43] text-white',
    border: 'border-emerald-500/40',
    text: 'text-gray-100',
    icon: 'text-emerald-400',
  },
  error: {
    bg: 'bg-[#2A0F15] text-white',
    border: 'border-rose-500/40',
    text: 'text-gray-100',
    icon: 'text-rose-400',
  },
  warning: {
    bg: 'bg-[#2B210C] text-white',
    border: 'border-[#C9A84C]/50',
    text: 'text-amber-100',
    icon: 'text-[#C9A84C]',
  },
  info: {
    bg: 'bg-[#1A3A5C] text-white',
    border: 'border-blue-400/40',
    text: 'text-blue-100',
    icon: 'text-blue-300',
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => {
          const Icon = ICONS[item.type];
          const style = STYLES[item.type];

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-start gap-3.5 ${style.bg} ${style.border}`}
            >
              <div className={`mt-0.5 shrink-0 ${style.icon}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 text-sm font-medium leading-relaxed pr-1">
                {item.message}
              </div>
              <button
                onClick={() => removeToast(item.id)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg shrink-0 -mr-1"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
