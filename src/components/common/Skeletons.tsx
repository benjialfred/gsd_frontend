import React from 'react';

/**
 * Skeleton pour la carte de découverte de Matchmaking
 */
export const MatchCardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-sm h-[580px] bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-lg flex flex-col animate-pulse">
      {/* Zone Photo Shimmer */}
      <div className="relative h-[420px] bg-gradient-to-b from-gray-200 to-gray-300">
        <div className="absolute top-4 left-4 w-28 h-7 bg-white/40 rounded-full" />
        <div className="absolute top-4 right-4 w-16 h-7 bg-white/40 rounded-full" />
        
        <div className="absolute bottom-6 left-6 right-6 space-y-2.5">
          <div className="w-3/5 h-7 bg-white/60 rounded-xl" />
          <div className="w-4/5 h-4 bg-white/40 rounded-lg" />
        </div>
      </div>

      {/* Barre d'actions Shimmer */}
      <div className="flex-1 bg-white p-5 flex items-center justify-around">
        <div className="w-12 h-12 rounded-full bg-gray-100" />
        <div className="w-14 h-14 rounded-full bg-gray-200" />
        <div className="w-12 h-12 rounded-full bg-gray-100" />
      </div>
    </div>
  );
};

/**
 * Grille de skeleton pour les Affinités / Matches confirmés
 */
export const MatchListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-sm flex flex-col">
          <div className="h-44 bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-gray-200 rounded-md w-3/4" />
            <div className="h-3.5 bg-gray-100 rounded-md w-1/2" />
            <div className="h-9 bg-gray-200 rounded-xl w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Grille de skeleton pour les formations de l'Académie
 */
export const CourseGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-sm flex flex-col">
          <div className="h-48 bg-gray-200" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-amber-100 rounded-full w-1/3" />
            <div className="h-5 bg-gray-200 rounded-md w-4/5" />
            <div className="h-3.5 bg-gray-100 rounded-md w-full" />
            <div className="h-10 bg-gray-200 rounded-2xl w-full pt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton pour la Bibliothèque Spirituelle
 */
export const LibrarySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-3xl border border-[#EFECE6] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-200" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-9 bg-gray-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton pour l'ActivityWidget
 */
export const ActivityFeedSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
          <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/5" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};
