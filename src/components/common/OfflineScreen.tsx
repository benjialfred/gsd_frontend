import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WifiOff, 
  ServerCrash, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useNetworkStore } from '../../stores/useNetworkStore';

export const OfflineScreen: React.FC = () => {
  const { 
    isOnline, 
    isServerError, 
    serverErrorCode, 
    serverErrorMessage,
    isOverlayDismissed, 
    isChecking, 
    cachedCount,
    dismissOverlay, 
    checkConnection 
  } = useNetworkStore();

  const [showTips, setShowTips] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // L'overlay s'affiche si on est hors-ligne OU s'il y a une erreur 500+, et que l'utilisateur n'a pas encore cliqué sur "Continuer hors-ligne"
  const isTriggered = (!isOnline || isServerError) && !isOverlayDismissed;

  if (!isTriggered) return null;

  const handleRetry = async () => {
    setTestResult(null);
    const success = await checkConnection();
    if (success) {
      setTestResult({ success: true, message: "Connexion rétablie avec succès !" });
    } else {
      setTestResult({ 
        success: false, 
        message: !isOnline 
          ? "Toujours aucun signal réseau détecté. Veuillez vérifier votre connexion." 
          : "Le serveur ne répond pas encore. Veuillez réessayer dans quelques instants." 
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#082a5e]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#EFECE6] max-w-lg w-full overflow-hidden flex flex-col text-left"
        >
          {/* Bannière visuelle supérieure */}
          <div className={`p-6 sm:p-8 text-center relative overflow-hidden ${
            isServerError 
              ? 'bg-gradient-to-b from-rose-50 to-white' 
              : 'bg-gradient-to-b from-amber-50 to-white'
          }`}>
            {/* Halo lumineux */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C9A84C]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Icône animée */}
            <div className="relative inline-block mb-4">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-md mx-auto ${
                isServerError 
                  ? 'bg-rose-100 text-rose-600' 
                  : 'bg-[#C9A84C]/15 text-[#C9A84C]'
              }`}>
                {isServerError ? (
                  <ServerCrash size={38} className="animate-pulse" />
                ) : (
                  <WifiOff size={38} className="animate-bounce" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                <AlertTriangle size={16} className={isServerError ? "text-rose-500" : "text-amber-500"} />
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-2xl font-serif font-bold text-[#1A3A5C] tracking-tight">
              {isServerError 
                ? `Incident Serveur (${serverErrorCode || 500})` 
                : "Connexion Réseau Interrompue"}
            </h2>

            {/* Description rassurante */}
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {isServerError ? (
                <>Le serveur central rencontre une indisponibilité momentanée. <strong>Aucune de vos données n'a été perdue</strong> et nos équipes interviennent.</>
              ) : (
                <>Votre appareil n'a plus d'accès Internet. Vous pouvez néanmoins continuer à naviguer grâce à vos <strong>données sauvegardées en mémoire locale</strong>.</>
              )}
            </p>

            {/* Badge de disponibilité du cache local */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Vos données déjà chargées restent intactes</span>
            </div>
          </div>

          {/* Corps de l'overlay */}
          <div className="p-6 sm:p-8 pt-0 space-y-4">
            
            {/* Message de résultat du test de connexion si déclenché */}
            {testResult && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2.5 ${
                  testResult.success 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </motion.div>
            )}

            {/* Accordéon Astuces de dépannage */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="w-full px-4 py-3 text-left text-xs font-semibold text-gray-700 flex items-center justify-between hover:bg-gray-100/60 transition-colors"
              >
                <span>Conseils pour rétablir la connexion</span>
                <ChevronDown size={14} className={`transform transition-transform text-gray-400 ${showTips ? 'rotate-180' : ''}`} />
              </button>

              {showTips && (
                <div className="p-4 pt-1 text-xs text-gray-600 space-y-2 border-t border-gray-100 bg-white">
                  <p>• Vérifiez que votre box Wi-Fi ou routeur est allumé et connecté.</p>
                  <p>• Si vous êtes sur mobile, vérifiez que les données mobiles sont activées.</p>
                  <p>• Vous pouvez tenter d'activer puis désactiver le mode avion.</p>
                  <p>• Si le serveur affiche l'erreur 500, patientez 1 minute le temps du redémarrage automatique.</p>
                </div>
              )}
            </div>

            {/* Actions principales */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleRetry}
                disabled={isChecking}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1A3A5C] text-white font-semibold text-sm shadow-md hover:bg-[#132c45] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                <RefreshCw size={16} className={isChecking ? "animate-spin text-[#C9A84C]" : ""} />
                <span>{isChecking ? "Vérification en cours..." : "Tester & Reconnecter"}</span>
              </button>

              <button
                type="button"
                onClick={dismissOverlay}
                className="w-full py-3.5 px-4 rounded-2xl bg-gray-100 text-[#1A3A5C] font-semibold text-sm hover:bg-gray-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Database size={16} className="text-[#C9A84C]" />
                <span>Continuer en mode hors-ligne</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <p className="text-[11px] text-center text-gray-400">
              GSD Plateforme • Mode Résilience Locale & Alliance Sacrée
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
