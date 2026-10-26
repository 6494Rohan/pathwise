import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { userKeys } from './userKeys';

export const useUserProfile = (userId: string) =>
  useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => userService.getProfile(userId),
    enabled: Boolean(userId),
  });
