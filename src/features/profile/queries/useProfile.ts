import { skipToken, useQuery } from '@tanstack/react-query';
import { useSession } from '@/features/auth';
import { profileService } from '../services/profileService';
import { profileKeys } from './profileKeys';

export const useProfile = () => {
  const { data: user } = useSession();
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: user ? profileService.getProfile : skipToken,
  });
};
