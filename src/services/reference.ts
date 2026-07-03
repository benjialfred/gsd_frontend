import api from './api';

export const getReferenceData = async () => {
  const response = await api.get('/api/profiles/reference-data/');
  return response.data;
};
