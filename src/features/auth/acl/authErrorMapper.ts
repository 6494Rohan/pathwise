import { AuthErrorCode, AuthFailure } from '../types/auth.types';

const CODES_BY_COGNITO_ERROR: Record<string, AuthErrorCode> = {
  NotAuthorizedException: 'wrongCredentials',
  UserNotFoundException: 'wrongCredentials',
  UsernameExistsException: 'emailTaken',
  InvalidPasswordException: 'weakPassword',
  CodeMismatchException: 'invalidCode',
  ExpiredCodeException: 'codeExpired',
  LimitExceededException: 'tooManyAttempts',
  TooManyRequestsException: 'tooManyAttempts',
  TooManyFailedAttemptsException: 'tooManyAttempts',
};

export const toAuthFailure = (error: unknown): AuthFailure => {
  if (error instanceof AuthFailure) return error;
  const name = error instanceof Error ? error.name : '';
  return new AuthFailure(CODES_BY_COGNITO_ERROR[name] ?? 'unknown');
};
