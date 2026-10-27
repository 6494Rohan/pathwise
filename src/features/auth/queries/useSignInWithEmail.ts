import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { AuthFailure, SignInInput, SignInResult } from '../types/auth.types';
import { authKeys } from './authKeys';

const signInWithEmail = async (input: SignInInput) => {
  const result = await authService.signInWithEmail(input);
  if (result === 'emailNotVerified') await authService.resendEmailCode(input.email);
  return result;
};

export const useSignInWithEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<SignInResult, AuthFailure, SignInInput>({
    mutationFn: signInWithEmail,
    onSuccess: (result) => {
      if (result === 'signedIn') queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
};
