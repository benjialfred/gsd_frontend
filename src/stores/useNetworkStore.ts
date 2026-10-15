import { create } from 'zustand';
import { countCachedResources } from '../services/offlineStorage';

interface NetworkState {
  isOnline: boolean;
  isServerError: boolean;
  serverErrorCode: number | null;
  serverErrorMessage: string | null;
  isOverlayDismissed: boolean;
  isChecking: boolean;
  cachedCount: number;
  lastCheckedAt: number | null;
  
  // Actions
  setOnline: (online: boolean) => void;
  setServerError: (status: number, message?: string) => void;
  clearServerError: () => void;
  dismissOverlay: () => void;
  showOverlay: () => void;
  updateCachedCount: () => Promise<void>;
  checkConnection: () => Promise<boolean>;
}

export const useNetworkStore = create<NetworkState>((set, get) => {
  const initialOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // Initialisation des écouteurs globaux du navigateur
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      // Re-tester activement pour s'assurer que la passerelle Internet répond
      get().checkConnection();
    });

    window.addEventListener('offline', () => {
      set({ 
        isOnline: false, 
        isOverlayDismissed: false // Ré-afficher l'overlay lors d'une coupure explicite
      });
      get().updateCachedCount();
    });
  }

  return {
    isOnline: initialOnline,
    isServerError: false,
    serverErrorCode: null,
    serverErrorMessage: null,
    isOverlayDismissed: false,
    isChecking: false,
    cachedCount: 0,
    lastCheckedAt: null,

    setOnline: (online: boolean) => {
      set((state) => ({
        isOnline: online,
        // Si on repasse en ligne, réinitialiser l'état d'erreur
        isServerError: online ? (state.isServerError ? false : state.isServerError) : state.isServerError,
        serverErrorCode: online ? null : state.serverErrorCode,
        lastCheckedAt: Date.now(),
      }));
      get().updateCachedCount();
    },

    setServerError: (status: number, message?: string) => {
      set({
        isServerError: true,
        serverErrorCode: status,
        serverErrorMessage: message || `Erreur serveur ${status}`,
        isOverlayDismissed: false,
      });
      get().updateCachedCount();
    },

    clearServerError: () => {
      set({
        isServerError: false,
        serverErrorCode: null,
        serverErrorMessage: null,
      });
    },

    dismissOverlay: () => {
      set({ isOverlayDismissed: true });
    },

    showOverlay: () => {
      set({ isOverlayDismissed: false });
    },

    updateCachedCount: async () => {
      const count = await countCachedResources();
      set({ cachedCount: count });
    },

    checkConnection: async () => {
      set({ isChecking: true });
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      try {
        // Envoi d'une requête légère avec un timeout court de 4 secondes
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(`${apiUrl}/api/users/me/`, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Si le serveur répond (même un 401 Unauthorized signifie que le serveur et la connexion sont bien vivants !)
        if (response.status < 500) {
          set({
            isOnline: true,
            isServerError: false,
            serverErrorCode: null,
            serverErrorMessage: null,
            isChecking: false,
            lastCheckedAt: Date.now(),
          });
          get().updateCachedCount();
          return true;
        } else {
          // Serveur répond mais avec une erreur 500+
          set({
            isOnline: true,
            isServerError: true,
            serverErrorCode: response.status,
            serverErrorMessage: `Le serveur a renvoyé une erreur ${response.status}`,
            isChecking: false,
            lastCheckedAt: Date.now(),
          });
          return false;
        }
      } catch (err: any) {
        // Échec réseau total (pas d'accès au réseau ou serveur éteint)
        const isOffline = !navigator.onLine || err.name === 'AbortError' || err.message?.includes('Failed to fetch');
        set({
          isOnline: !isOffline ? true : false,
          isServerError: !isOffline,
          serverErrorCode: isOffline ? null : 503,
          serverErrorMessage: isOffline ? 'Connexion réseau coupée' : 'Serveur inaccessible',
          isChecking: false,
          lastCheckedAt: Date.now(),
        });
        get().updateCachedCount();
        return false;
      }
    },
  };
});
