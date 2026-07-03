import React from 'react';
import { WifiOff, Loader2, RefreshCw, Clock, Coffee } from 'lucide-react';
import Button from '@/shared/components/Button';

// 1. Loading Skeleton
export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[600px] max-w-md mx-auto bg-gsd-surface rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-pulse border border-white/5">
      <div className="flex-1 bg-white/5" />
      <div className="p-6 bg-gsd-surface border-t border-white/5 h-[200px]">
        <div className="h-16 w-full bg-white/10 rounded-xl mb-6" />
        <div className="h-8 w-2/3 bg-white/10 rounded-lg mb-2" />
        <div className="h-4 w-1/3 bg-white/5 rounded-md" />
        <div className="flex gap-4 mt-6">
          <div className="flex-1 h-14 bg-white/5 rounded-xl" />
          <div className="flex-1 h-14 bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

// 2. Empty Queue
export const EmptyQueueState: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  return (
    <div className="w-full h-[600px] max-w-md mx-auto flex flex-col items-center justify-center p-8 text-center bg-gsd-surface/50 rounded-2xl border border-white/5">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <RefreshCw size={40} className="text-gsd-primary opacity-50" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Aucun profil disponible</h3>
      <p className="text-gsd-text-secondary mb-8 leading-relaxed">
        Nous avons parcouru toutes nos suggestions pour le moment. Nous élargissons continuellement notre base de données.
      </p>
      <Button variant="outline" onClick={onRefresh} className="rounded-xl w-full">
        Actualiser la file
      </Button>
    </div>
  );
};

// 3. Daily Limit (Anti-Burn)
export const DailyLimitState: React.FC<{ resetAt?: string }> = ({ resetAt }) => {
  return (
    <div className="w-full h-[600px] max-w-md mx-auto flex flex-col items-center justify-center p-8 text-center bg-gsd-surface/50 rounded-2xl border border-white/5">
      <div className="w-24 h-24 bg-gsd-primary/10 rounded-full flex items-center justify-center mb-6 border border-gsd-primary/20">
        <Coffee size={40} className="text-gsd-primary" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Limite quotidienne atteinte</h3>
      <p className="text-gsd-text-secondary mb-6 leading-relaxed">
        Vous avez consulté tous vos profils aujourd'hui. Prenez le temps de discuter avec vos matchs actuels.
      </p>
      
      {resetAt && (
        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-full text-gsd-primary-light text-sm font-medium">
          <Clock size={16} />
          Renouvellement à {new Date(resetAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

// 4. Offline State
export const OfflineState: React.FC = () => {
  return (
    <div className="w-full h-[600px] max-w-md mx-auto flex flex-col items-center justify-center p-8 text-center bg-gsd-surface/50 rounded-2xl border border-red-500/20">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <WifiOff size={40} className="text-red-400" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Connexion indisponible</h3>
      <p className="text-gsd-text-secondary leading-relaxed">
        Vérifiez votre connexion internet pour continuer à découvrir de nouveaux profils.
      </p>
    </div>
  );
};

interface DiscoveryStateHandlerProps {
  isOffline: boolean;
  isLoading: boolean;
  isDailyLimitReached: boolean;
  isEmpty: boolean;
  resetAt?: string;
  onRefresh: () => void;
  children: React.ReactNode;
}

export const DiscoveryStateHandler: React.FC<DiscoveryStateHandlerProps> = ({
  isOffline,
  isLoading,
  isDailyLimitReached,
  isEmpty,
  resetAt,
  onRefresh,
  children
}) => {
  // Strict Order: Offline -> Loading -> DailyLimit -> EmptyQueue -> Content
  if (isOffline) return <OfflineState />;
  if (isLoading) return <LoadingSkeleton />;
  if (isDailyLimitReached) return <DailyLimitState resetAt={resetAt} />;
  if (isEmpty) return <EmptyQueueState onRefresh={onRefresh} />;
  
  return <>{children}</>;
};
