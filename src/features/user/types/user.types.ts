import { z } from 'zod';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2, 'common:validation.nameTooShort'),
  email: z.email('common:validation.emailInvalid'),
  avatarUrl: z.url('common:validation.urlInvalid').optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
