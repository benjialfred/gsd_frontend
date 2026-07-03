import React, { useState, useEffect, useCallback } from 'react';
import type { MatchCandidate } from '../types';
import { getSuggestions, submitSwipeAction } from '../api';
import PremiumProfileCard from './PremiumProfileCard';
import MatchModal from './MatchModal';
import { DiscoveryStateHandler } from './DiscoveryStates';

// Mock Analytics for this component
const AnalyticsService = {
  track: (event: string, properties?: any) => {
    console.log(`[Analytics] ${event}`, properties);
  }
};

export const MatchEngine: React.FC = () => {
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // States from API regarding Anti-Burn
  const [isDailyLimitReached, setIsDailyLimitReached] = useState(false);
  const [resetAt, setResetAt] = useState<string | undefined>(undefined);

  // Match Modal state
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchCandidate, setMatchCandidate] = useState<MatchCandidate | null>(null);

  // Network listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchCandidates = useCallback(async () => {
    if (isOffline) return;
    setIsLoading(true);
    try {
      // getSuggestions should be updated to return the full payload including remaining limits
      // For now, we assume it returns an array of MatchCandidate
      const data = await getSuggestions();
      setCandidates(data);
      if (data.length > 0) {
        AnalyticsService.track('DISCOVERY_VIEWED', { count: data.length });
        AnalyticsService.track('PROFILE_OPENED', { candidate_id: data[0].candidate_id });
      } else {
        AnalyticsService.track('MATCH_QUEUE_EMPTY');
      }
    } catch (error: any) {
      // Check for Anti-Burn 429 response
      if (error.response?.status === 429 || error.response?.data?.limit_reached) {
        setIsDailyLimitReached(true);
        setResetAt(error.response.data.reset_at);
        AnalyticsService.track('DISCOVERY_LIMIT_REACHED');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isOffline]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleAction = async (action: 'LIKE' | 'PASS') => {
    if (candidates.length === 0) return;
    
    const currentCandidate = candidates[0];
    
    AnalyticsService.track(action === 'LIKE' ? 'PROFILE_LIKED' : 'PROFILE_PASSED', {
      candidate_id: currentCandidate.candidate_id,
      feed_version: currentCandidate.feed_version
    });

    // Optimistic UI update: remove the top card immediately
    setCandidates((prev) => prev.slice(1));
    
    // Track next profile opened if available
    if (candidates.length > 1) {
      AnalyticsService.track('PROFILE_OPENED', { candidate_id: candidates[1].candidate_id });
    } else {
      // Need to fetch more
      fetchCandidates();
    }

    try {
      const response = await submitSwipeAction(currentCandidate.candidate_id, action);
      if (response.status === 'matched') {
        AnalyticsService.track('MATCH_CREATED', { match_id: response.match_id });
        setMatchCandidate(currentCandidate);
        setIsMatchModalOpen(true);
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        setIsDailyLimitReached(true);
      }
      // Possible rollback on error if strictly needed
    }
  };

  const currentCandidate = candidates[0];

  return (
    <div className="w-full h-full min-h-screen bg-black flex items-center justify-center p-4">
      <DiscoveryStateHandler
        isOffline={isOffline}
        isLoading={isLoading}
        isDailyLimitReached={isDailyLimitReached}
        isEmpty={candidates.length === 0}
        resetAt={resetAt}
        onRefresh={fetchCandidates}
      >
        {currentCandidate && (
          <PremiumProfileCard 
            key={currentCandidate.id}
            candidate={currentCandidate}
            onLike={() => handleAction('LIKE')}
            onPass={() => handleAction('PASS')}
          />
        )}
      </DiscoveryStateHandler>

      {matchCandidate && (
        <MatchModal
          isOpen={isMatchModalOpen}
          candidate={matchCandidate}
          onClose={() => setIsMatchModalOpen(false)}
          onStartChat={() => {
            setIsMatchModalOpen(false);
            // Navigate to chat
          }}
        />
      )}
    </div>
  );
};

export default MatchEngine;
