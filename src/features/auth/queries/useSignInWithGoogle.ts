import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { AuthFailure, GoogleAccount, SessionUser } from '../types/auth.types';
import { authKeys } from './authKeys';

const signInWithAccount = async (account: GoogleAccount) => {
  await authService.signInWithGoogleAccount(account);
  return authService.getSessionUser();
};

// Picking an account is its own step so the screen only locks once Cognito is involved; the native
// picker is already modal, and locking behind it made the screen flicker when the picker was dismissed.
export const useSignInWithGoogle = () => {
  const queryClient = useQueryClient();
  const pickAccount = useMutation<GoogleAccount | null, AuthFailure>({ mutationFn: authService.pickGoogleAccount });
  const signIn = useMutation<SessionUser | null, AuthFailure, GoogleAccount>({
    mutationFn: signInWithAccount,
    onSuccess: (user) => {
      if (user) queryClient.setQueryData(authKeys.session(), user);
    },
  });

  const start = () => {
    if (pickAccount.isPending || signIn.isPending) return;
    pickAccount.mutate(undefined, {
      onSuccess: (account) => {
        if (account) signIn.mutate(account);
      },
    });
  };

  return { start, isPending: signIn.isPending, error: pickAccount.error ?? signIn.error };
};
