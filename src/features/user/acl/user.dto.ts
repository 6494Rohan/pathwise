import { z } from 'zod';

export const UserProfileDtoSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email_address: z.email(),
  avatar_url: z.url().nullable().optional(),
});

export type UserProfileDto = z.infer<typeof UserProfileDtoSchema>;

export interface UpdateProfileRequestDto {
  full_name: string;
  email_address: string;
  avatar_url: string | null;
}
