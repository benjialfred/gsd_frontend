import api from './api';

export const updateProfile = async (data: any) => {
  // Les champs 'first_name', 'last_name' appartiennent au modèle User
  const userFields = ['first_name', 'last_name'];
  const payload: any = { profile: {} };

  Object.keys(data).forEach(key => {
    if (userFields.includes(key)) {
      payload[key] = data[key];
    } else {
      payload.profile[key] = data[key];
    }
  });

  const response = await api.patch('/api/users/me/', payload);
  return response.data;
};

export const getProfileCompletion = async () => {
  const response = await api.get('/api/profiles/me/completion/');
  return response.data;
};

export const getMediaUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const uploadMedia = async (file: File, isPrimary: boolean = false) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('is_primary', isPrimary ? 'true' : 'false');
  formData.append('media_type', file.type.startsWith('video') ? 'VIDEO' : 'IMAGE');

  const response = await api.post('/api/profiles/me/media/', formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return response.data;
};

export const submitKYC = async (front: File, back: File, selfie: File) => {
  const formData = new FormData();
  formData.append('id_document_front', front);
  formData.append('id_document_back', back);
  formData.append('selfie_video', selfie);

  const response = await api.post('/api/profiles/me/kyc/', formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return response.data;
};

