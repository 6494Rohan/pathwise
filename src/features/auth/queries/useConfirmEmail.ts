import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { AuthFailure, ConfirmEmailResult } from '../types/auth.types';
import { authKeys } from './authKeys';

interface ConfirmEmailInput {
  email: string;
  code: string;
}

export const useConfirmEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<ConfirmEmailResult, AuthFailure, ConfirmEmailInput>({
    mutationFn: ({ email, code }) => authService.confirmEmail(email, code),
    onSuccess: (result) => {
      if (result === 'signedIn') queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
};
