import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_APP_VARIANT: z.enum(['develop', 'qa', 'preprod', 'prod']).default('develop'),
  EXPO_PUBLIC_API_URL: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Expo only inlines EXPO_PUBLIC_* vars that are read statically, so list each one.
const parsed = envSchema.safeParse({
  EXPO_PUBLIC_APP_VARIANT: process.env.EXPO_PUBLIC_APP_VARIANT || undefined,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || undefined,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const env: Env = parsed.data;
