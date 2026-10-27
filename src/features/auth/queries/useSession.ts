import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { authKeys } from './authKeys';

export const useSession = () =>
  useQuery({
    queryKey: authKeys.session(),
    queryFn: authService.getSessionUser,
    staleTime: Infinity,
    retry: false,
  });
