import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import './index.css'
import App from './App.tsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 10 * 60 * 1000, // 10 minutes de fraîcheur
      gcTime: 24 * 60 * 60 * 1000, // 24 heures de persistance locale
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: (failureCount) => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
        return failureCount < 1;
      },
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'GSD_REACT_QUERY_OFFLINE_CACHE',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
)
