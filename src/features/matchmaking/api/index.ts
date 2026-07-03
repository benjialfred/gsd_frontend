import api from '../../../services/api';
import type { MatchCandidate, SuggestionsResponse, MatchActionResponse } from '../types';

export const getSuggestions = async (): Promise<MatchCandidate[]> => {
  const response = await api.get('/matchmaking/suggestions/');
  return response.data.suggestions;
};

export const submitSwipeAction = async (candidateId: number, action: 'LIKE' | 'PASS' | 'SUPER_LIKE'): Promise<MatchActionResponse> => {
  const response = await api.post('/matchmaking/action/', {
    candidate_id: candidateId,
    action: action
  });
  return response.data;
};
