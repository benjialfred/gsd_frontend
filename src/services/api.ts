import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { 
  saveToOfflineCache, 
  getFromOfflineCache, 
  getFromOfflineCacheSync, 
  clearAllOfflineCache, 
  hydrateOfflineStorage 
} from './offlineStorage';
import { useNetworkStore } from '../stores/useNetworkStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 35000, // Timeout de 35s pour absorber les démarrages à froid de Render
});

// Hydratation asynchrone initiale du cache hors-ligne
hydrateOfflineStorage().catch((err: any) => {
  console.warn('[API Cache] Erreur hydratation initiale:', err);
});

// Cache mémoire vive L1 et déduplication des requêtes en vol
interface CacheEntry {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<any>>();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes de fraîcheur

export const clearApiCache = (prefix?: string) => {
  if (!prefix) {
    memoryCache.clear();
    inFlightRequests.clear();
  } else {
    for (const key of Array.from(memoryCache.keys())) {
      if (key.includes(prefix)) {
        memoryCache.delete(key);
      }
    }
    for (const key of Array.from(inFlightRequests.keys())) {
      if (key.includes(prefix)) {
        inFlightRequests.delete(key);
      }
    }
  }
  clearAllOfflineCache(prefix).catch(() => {});
};

// Invalidation automatique du cache lors des mutations
const invalidateCacheForUrl = (url: string) => {
  if (!url) return;
  if (url.includes('/academy/')) clearApiCache('/academy/');
  if (url.includes('/users/') || url.includes('/profiles/')) {
    clearApiCache('/users/');
    clearApiCache('/profiles/');
  }
  if (url.includes('/matchmaking/')) clearApiCache('/matchmaking/');
  if (url.includes('/analytics/')) clearApiCache('/analytics/');
  if (url.includes('/coaching/')) clearApiCache('/coaching/');
  if (url.includes('/events/')) clearApiCache('/events/');
  if (url.includes('/subscriptions/')) clearApiCache('/subscriptions/');
  if (url.includes('/payments/')) clearApiCache('/payments/');
};

// Intercepteur Requête : Injection Token JWT & Invalidation Mutations
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Si les données sont FormData, laisser le navigateur injecter le boundary multipart
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    const method = config.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
      invalidateCacheForUrl(config.url || '');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Surcharge de api.get avec stratégie Résilience Offline-First et Cache Persistant
const originalGet = api.get.bind(api);

(api as any).get = async function <T = any, R = AxiosResponse<T>, D = any>(
  url: string,
  config?: AxiosRequestConfig<D> & { skipCache?: boolean }
): Promise<R> {
  const skipCache = config?.skipCache === true;
  const cacheKey = `${url}?${JSON.stringify(config?.params || {})}`;

  // 1. Si on est hors-ligne d'office (navigator.onLine === false), renvoyer immédiatement le cache
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  if (isOffline && !skipCache) {
    const cached = (await getFromOfflineCache(cacheKey)) || getFromOfflineCacheSync(cacheKey);
    if (cached) {
      useNetworkStore.getState().setOnline(false);
      return {
        data: cached.data,
        status: cached.status || 200,
        statusText: 'OK (Mode Hors-ligne)',
        headers: cached.headers || {},
        config: config as any,
        isOfflineCached: true,
      } as unknown as R;
    }
  }

  // 2. Vérification Cache Mémoire L1 (si données fraîches)
  if (!skipCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < DEFAULT_TTL_MS)) {
      return {
        data: cached.data,
        status: cached.status,
        statusText: cached.statusText,
        headers: cached.headers,
        config: config as any,
      } as unknown as R;
    }

    // Déduplication des requêtes en cours d'exécution
    const pending = inFlightRequests.get(cacheKey);
    if (pending) {
      return pending as Promise<R>;
    }
  }

  // 3. Exécution de la requête réseau avec filet de sécurité Offline
  const promise = (async () => {
    try {
      const response = await originalGet(url, config);
      
      // En cas de succès 200, sauvegarder en L1 et persister en IndexedDB L2
      if (!skipCache && response.status === 200) {
        const entry = {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config,
          timestamp: Date.now(),
        };
        memoryCache.set(cacheKey, entry);
        saveToOfflineCache(cacheKey, entry).catch(() => {});
        
        // Mettre à jour l'état réseau (en ligne et stable)
        useNetworkStore.getState().setOnline(true);
        useNetworkStore.getState().clearServerError();
      }
      
      return response;
    } catch (err: any) {
      // DÉTECTION PANNE RÉSEAU OU ERREUR SERVEUR (500, 502, 503, 504, ERR_NETWORK)
      const isNetworkError = !err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED';
      const isServerError = err.response && err.response.status >= 500;

      if (isNetworkError) {
        useNetworkStore.getState().setOnline(false);
      } else if (isServerError) {
        useNetworkStore.getState().setServerError(err.response.status, err.message);
      }

      // VÉRIFICATION D'URGENCE DU CACHE PERSISTANT : Ne JAMAIS faire disparaître les données déjà chargées !
      if (!skipCache && (isNetworkError || isServerError)) {
        const fallback = (await getFromOfflineCache(cacheKey)) || memoryCache.get(cacheKey);
        if (fallback) {
          console.info(`[GSD Offline Resilience] Données chargées depuis le cache local pour : ${url}`);
          return {
            data: fallback.data,
            status: fallback.status || 200,
            statusText: 'OK (Secours Cache Hors-Ligne)',
            headers: fallback.headers || {},
            config: config as any,
            isOfflineCached: true,
          } as unknown as R;
        }
      }

      // Si aucune copie locale n'est disponible, propager l'erreur
      throw err;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  if (!skipCache) {
    inFlightRequests.set(cacheKey, promise);
  }

  return promise as Promise<R>;
};

// Intercepteur Réponse : Rafraîchissement silencieux sécurisé
api.interceptors.response.use(
  (response) => {
    // Si la requête réussit, s'assurer que le store réseau est à jour
    if (response.status < 500) {
      useNetworkStore.getState().clearServerError();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Détection panne serveur ou réseau sur toute requête
    if (!error.response || error.code === 'ERR_NETWORK') {
      useNetworkStore.getState().setOnline(false);
    } else if (error.response?.status >= 500) {
      useNetworkStore.getState().setServerError(error.response.status, error.message);
    }

    // Gestion de l'expiration du Token (401 Unauthorized)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh');
      
      if (refreshToken) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const newAccess = res.data.access;
          localStorage.setItem('access', newAccess);
          
          // Rejouer la requête avec le nouveau jeton
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshError: any) {
          // CRITIQUE : Déconnecter UNIQUEMENT si le jeton est explicitement refusé par le serveur (400, 401, 403)
          // Ne JAMAIS déconnecter en cas de coupure internet ou d'erreur 500 temporaire !
          if (refreshError.response && [400, 401, 403].includes(refreshError.response.status)) {
            clearApiCache();
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
