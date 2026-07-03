import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SaveAndExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SaveAndExitModal: React.FC<SaveAndExitModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-xl"
          >
            <h3 className="text-2xl font-light text-gray-900 mb-3">Sauvegarder et quitter ?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Votre progression sera sauvegardée. Vous pourrez reprendre exactement là où vous vous êtes arrêté lors de votre prochaine connexion.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                Quitter
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
