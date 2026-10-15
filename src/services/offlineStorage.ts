import { get, set, del, keys } from 'idb-keyval';

export interface PersistedCacheEntry {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config?: any;
  timestamp: number;
  url?: string;
}

export interface OfflineMutation {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload: any;
  timestamp: number;
  label?: string;
}

const CACHE_PREFIX = 'gsd_api_cache:';
const MUTATION_QUEUE_KEY = 'gsd_offline_mutation_queue';
const memoryFallbackMap = new Map<string, PersistedCacheEntry>();

/**
 * Hydrate en mémoire les entrées sauvegardées pour les lectures synchrones ultra-rapides
 */
export async function hydrateOfflineStorage(): Promise<void> {
  try {
    if (typeof localStorage !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          try {
            const raw = localStorage.getItem(k);
            if (raw) {
              const item = JSON.parse(raw);
              const cleanKey = k.replace(CACHE_PREFIX, '');
              memoryFallbackMap.set(cleanKey, item);
            }
          } catch {
            // Ignore
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('[OfflineStorage] Erreur hydratation initiale:', err);
  }
}

/**
 * Sauvegarde une entrée de cache API dans IndexedDB et localStorage
 */
export async function saveToOfflineCache(key: string, entry: PersistedCacheEntry): Promise<void> {
  const fullKey = `${CACHE_PREFIX}${key}`;
  memoryFallbackMap.set(key, entry);

  try {
    const cleanEntry: PersistedCacheEntry = {
      data: JSON.parse(JSON.stringify(entry.data)),
      status: entry.status,
      statusText: entry.statusText,
      headers: entry.headers ? JSON.parse(JSON.stringify(entry.headers)) : {},
      timestamp: entry.timestamp,
      url: entry.url,
    };
    await set(fullKey, cleanEntry);
  } catch (err: any) {
    console.warn('[OfflineStorage] Échec IndexedDB, repli localStorage:', err);
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(fullKey, JSON.stringify(entry));
    }
  } catch {
    // Quota localStorage dépassé, IndexedDB prend le relais
  }
}

/**
 * Récupère une entrée depuis le cache (mémoire, IndexedDB ou localStorage)
 */
export async function getFromOfflineCache(key: string): Promise<PersistedCacheEntry | null> {
  if (memoryFallbackMap.has(key)) {
    return memoryFallbackMap.get(key)!;
  }

  const fullKey = `${CACHE_PREFIX}${key}`;
  try {
    const entry = await get<PersistedCacheEntry>(fullKey);
    if (entry && entry.data !== undefined) {
      memoryFallbackMap.set(key, entry);
      return entry;
    }
  } catch {
    // Repli
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const local = localStorage.getItem(fullKey);
      if (local) {
        const parsed = JSON.parse(local);
        memoryFallbackMap.set(key, parsed);
        return parsed;
      }
    }
  } catch {
    // Ignore
  }

  return null;
}

/**
 * Lecture synchrone immédiate (depuis le cache mémoire ou localStorage)
 */
export function getFromOfflineCacheSync(key: string): PersistedCacheEntry | null {
  if (memoryFallbackMap.has(key)) {
    return memoryFallbackMap.get(key)!;
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const local = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (local) {
        const parsed = JSON.parse(local);
        memoryFallbackMap.set(key, parsed);
        return parsed;
      }
    }
  } catch {
    // Ignore
  }
  return null;
}

/**
 * Vide le cache hors-ligne (en entier ou filtré par préfixe d'URL)
 */
export async function clearAllOfflineCache(prefix?: string): Promise<void> {
  if (!prefix) {
    memoryFallbackMap.clear();
  } else {
    for (const k of Array.from(memoryFallbackMap.keys())) {
      if (k.includes(prefix)) {
        memoryFallbackMap.delete(k);
      }
    }
  }

  try {
    const allKeys = await keys();
    for (const k of allKeys) {
      const strKey = String(k);
      if (strKey.startsWith(CACHE_PREFIX)) {
        if (!prefix || strKey.includes(prefix)) {
          await del(k);
        }
      }
    }
  } catch {
    // Ignore
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          if (!prefix || k.includes(prefix)) {
            toRemove.push(k);
          }
        }
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    }
  } catch {
    // Ignore
  }
}

/**
 * Compte le nombre de ressources actuellement conservées en cache hors ligne
 */
export async function countCachedResources(): Promise<number> {
  try {
    const allKeys = await keys();
    const count = allKeys.filter((k) => String(k).startsWith(CACHE_PREFIX)).length;
    return Math.max(count, memoryFallbackMap.size);
  } catch {
    return memoryFallbackMap.size;
  }
}

/**
 * Liste les URLs actuellement en cache
 */
export async function listCachedEndpoints(): Promise<string[]> {
  try {
    const allKeys = await keys();
    const setKeys = new Set<string>();
    allKeys.forEach((k) => {
      const s = String(k);
      if (s.startsWith(CACHE_PREFIX)) setKeys.add(s.replace(CACHE_PREFIX, ''));
    });
    memoryFallbackMap.forEach((_, k) => setKeys.add(k));
    return Array.from(setKeys);
  } catch {
    return Array.from(memoryFallbackMap.keys());
  }
}

/**
 * File d'attente des mutations effectuées hors ligne
 */
export async function queueOfflineMutation(mutation: Omit<OfflineMutation, 'id' | 'timestamp'>): Promise<void> {
  const item: OfflineMutation = {
    ...mutation,
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  try {
    const queue = (await get<OfflineMutation[]>(MUTATION_QUEUE_KEY)) || [];
    queue.push(item);
    await set(MUTATION_QUEUE_KEY, queue);
  } catch {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(MUTATION_QUEUE_KEY);
      const queue: OfflineMutation[] = raw ? JSON.parse(raw) : [];
      queue.push(item);
      localStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(queue));
    }
  }
}

export async function getOfflineMutations(): Promise<OfflineMutation[]> {
  try {
    const queue = await get<OfflineMutation[]>(MUTATION_QUEUE_KEY);
    if (queue && Array.isArray(queue)) return queue;
  } catch {
    // Repli
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(MUTATION_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    }
  } catch {
    // Ignore
  }
  return [];
}

export async function clearOfflineMutations(): Promise<void> {
  try {
    await del(MUTATION_QUEUE_KEY);
  } catch {
    // Ignore
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(MUTATION_QUEUE_KEY);
  }
}

// Alias de compatibilité
export const saveCachedResponse = (key: string, data: any, status = 200, statusText = 'OK', headers: any = {}) =>
  saveToOfflineCache(key, { data, status, statusText, headers, timestamp: Date.now() });
export const getCachedResponse = getFromOfflineCache;
export const clearCachedResponses = clearAllOfflineCache;
