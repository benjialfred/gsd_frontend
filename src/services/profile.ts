import api from './api';

export const updateProfile = async (data: any) => {
  // Le backend attend "profile" imbriqué pour les champs de profil
  const payload = { profile: data };
  const response = await api.patch('/api/users/me/', payload);
  return response.data;
};

export const getProfileCompletion = async () => {
  const response = await api.get('/api/profiles/me/completion/');
  return response.data;
};

export const uploadMedia = async (file: File, isPrimary: boolean = false) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('is_primary', isPrimary ? 'true' : 'false');
  // media_type peut être déduit, mais on l'envoie si besoin
  formData.append('media_type', file.type.startsWith('video') ? 'VIDEO' : 'IMAGE');

  const response = await api.post('/api/profiles/me/media/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
