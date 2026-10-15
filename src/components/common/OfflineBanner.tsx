import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, ServerCrash, ExternalLink } from 'lucide-react';
import { useNetworkStore } from '../../stores/useNetworkStore';

export const OfflineBanner: React.FC = () => {
  const { 
    isOnline, 
    isServerError, 
    serverErrorCode,
    isOverlayDismissed, 
    isChecking, 
    showOverlay, 
    checkConnection 
  } = useNetworkStore();

  const isOfflineOrError = !isOnline || isServerError;

  // Si tout va bien, pas de bandeau
  if (!isOfflineOrError) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#1A3A5C] via-[#244b75] to-[#1A3A5C] text-white px-4 py-2.5 text-xs shadow-md border-b border-[#C9A84C]/30 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>

          {isServerError ? (
            <ServerCrash size={15} className="text-[#C9A84C] shrink-0" />
          ) : (
            <WifiOff size={15} className="text-[#C9A84C] shrink-0" />
          )}

          <div className="leading-tight">
            <span className="font-bold text-[#C9A84C]">
              {isServerError ? `Incident Serveur (${serverErrorCode || 500})` : 'Mode Hors-ligne'} :
            </span>{' '}
            <span className="text-gray-200">
              {isServerError 
                ? 'Le serveur est indisponible. Données locales affichées.'
                : 'Connexion réseau coupée. Vous consultez les données en mémoire locale.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => checkConnection()}
            disabled={isChecking}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={isChecking ? "animate-spin text-[#C9A84C]" : ""} />
            <span>{isChecking ? 'Test...' : 'Réessayer'}</span>
          </button>

          <button
            type="button"
            onClick={showOverlay}
            className="px-2.5 py-1 rounded-full bg-[#C9A84C] hover:bg-[#b8953c] text-[#1A3A5C] font-bold flex items-center gap-1 cursor-pointer transition-all"
            title="Ouvrir le panneau d'état"
          >
            <span>Détails</span>
            <ExternalLink size={11} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
