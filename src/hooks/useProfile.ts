import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateProfile, getProfileCompletion, uploadMedia, submitKYC } from '../services/profile';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => updateProfile(data),
    onSuccess: () => {
      // Refresh completion percentage when profile updates
      queryClient.invalidateQueries({ queryKey: ['profileCompletion'] });
      // Refresh user details (if cached)
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useProfileCompletion = () => {
  return useQuery({
    queryKey: ['profileCompletion'],
    queryFn: getProfileCompletion,
  });
};

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: ({ file, isPrimary }: { file: File; isPrimary?: boolean }) =>
      uploadMedia(file, isPrimary),
  });
};

export const useSubmitKYCMutation = () => {
  return useMutation({
    mutationFn: ({ front, back, selfie }: { front: File; back: File; selfie: File }) =>
      submitKYC(front, back, selfie),
  });
};
