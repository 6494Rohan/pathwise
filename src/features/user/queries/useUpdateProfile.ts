import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { UpdateProfileInput } from '../types/user.types';
import { userKeys } from './userKeys';

export const useUpdateProfile = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => userService.updateProfile(userId, data),
    onSuccess: (profile) => queryClient.setQueryData(userKeys.profile(userId), profile),
  });
};
