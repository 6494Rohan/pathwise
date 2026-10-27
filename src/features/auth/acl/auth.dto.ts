import { z } from 'zod';

export const CurrentUserDtoSchema = z.object({
  userId: z.string(),
  username: z.string(),
});

export const SignInOutputDtoSchema = z.object({
  nextStep: z.object({ signInStep: z.string() }),
});

export const SignUpOutputDtoSchema = z.object({
  nextStep: z.object({ signUpStep: z.string() }),
});
