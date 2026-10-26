import { api } from '@/services/api';
import { toUpdateProfileRequest, toUserProfile } from '../acl/userMapper';
import { UpdateProfileInput, UpdateProfileSchema, UserProfile } from '../types/user.types';

export const userService = {
  getProfile: async (userId: string): Promise<UserProfile> =>
    toUserProfile(await api.get(`/users/${userId}`)),

  updateProfile: async (userId: string, input: UpdateProfileInput): Promise<UserProfile> => {
    const body = toUpdateProfileRequest(UpdateProfileSchema.parse(input));
    return toUserProfile(await api.put(`/users/${userId}`, body));
  },
};
