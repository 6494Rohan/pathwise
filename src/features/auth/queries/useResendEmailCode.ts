import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { AuthFailure } from '../types/auth.types';

export const useResendEmailCode = () =>
  useMutation<void, AuthFailure, string>({
    mutationFn: authService.resendEmailCode,
  });
