import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { SessionUser } from '../types/auth.types';
import { authKeys } from './authKeys';

export const clearSession = (queryClient: QueryClient) => {
  // A session check still in flight would otherwise land after this and bring the signed-in user back.
  void queryClient.cancelQueries({ queryKey: authKeys.session() });
  queryClient.setQueryData<SessionUser | null>(authKeys.session(), null);
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== authKeys.all[0] });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => clearSession(queryClient),
    onError: () => queryClient.invalidateQueries({ queryKey: authKeys.session() }),
  });
};
