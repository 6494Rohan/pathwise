import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { AuthFailure, SignUpInput } from '../types/auth.types';

export const useSignUpWithEmail = () =>
  useMutation<void, AuthFailure, SignUpInput>({
    mutationFn: authService.signUpWithEmail,
  });
