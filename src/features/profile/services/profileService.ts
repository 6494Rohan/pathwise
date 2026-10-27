import { toProfile } from '../acl/profileMapper';
import { dummyProfileResponse } from './dummyProfileData';

// Dummy data until the profile API exists: replace `respond(...)` with `api.get(...)`; the mapper stays.
const DUMMY_LATENCY_MS = 400;
const respond = (data: unknown) => new Promise<unknown>((resolve) => setTimeout(() => resolve(data), DUMMY_LATENCY_MS));

export const profileService = {
  getProfile: async () => toProfile(await respond(dummyProfileResponse)),
};
