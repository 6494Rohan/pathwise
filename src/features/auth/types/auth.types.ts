import { z } from 'zod';

export interface SessionUser {
  id: string;
  username: string;
}

export type SignInResult = 'signedIn' | 'emailNotVerified';
export interface GoogleAccount {
  email: string;
  name: string | null;
  idToken: string;
}
export type ConfirmEmailResult = 'signedIn' | 'signInRequired';

export type AuthErrorCode =
  | 'wrongCredentials'
  | 'emailTaken'
  | 'weakPassword'
  | 'invalidCode'
  | 'codeExpired'
  | 'tooManyAttempts'
  | 'unknown';

export class AuthFailure extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(code);
    this.name = 'AuthFailure';
  }
}

const email = z.email('common:validation.emailInvalid');

// Mirrors the Cognito default password policy so users see the rule before submitting.
const password = z
  .string()
  .min(8, 'common:validation.passwordTooShort')
  .regex(/[a-z]/, 'auth:validation.passwordWeak')
  .regex(/[A-Z]/, 'auth:validation.passwordWeak')
  .regex(/\d/, 'auth:validation.passwordWeak')
  .regex(/[^A-Za-z0-9]/, 'auth:validation.passwordWeak');

export const EmailSchema = z.object({ email });

export const SignInSchema = z.object({
  email,
  password: z.string().min(1, 'common:validation.passwordRequired'),
});

export const SignUpSchema = z
  .object({
    name: z.string().trim().min(2, 'common:validation.nameTooShort'),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'auth:validation.passwordsDontMatch',
  });

export const VerifyEmailSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'auth:validation.codeInvalid'),
});

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
