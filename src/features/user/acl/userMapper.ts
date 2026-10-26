import type { UpdateProfileInput, UserProfile } from '../types/user.types';
import { UpdateProfileRequestDto, UserProfileDtoSchema } from './user.dto';

export const toUserProfile = (raw: unknown): UserProfile => {
  const dto = UserProfileDtoSchema.parse(raw);
  return {
    id: dto.id,
    name: dto.full_name,
    email: dto.email_address,
    avatarUrl: dto.avatar_url ?? undefined,
  };
};

export const toUpdateProfileRequest = (input: UpdateProfileInput): UpdateProfileRequestDto => ({
  full_name: input.name,
  email_address: input.email,
  avatar_url: input.avatarUrl ?? null,
});
