import { api, ApiError, uploadToPresignedPost } from '@/services/api';
import {
  toParseResumeRequest,
  toProfile,
  toResumeDownload,
  toResumeErrorCode,
  toResumeUploadTarget,
} from '../acl/profileMapper';
import { PickedResume, ResumeError } from '../types/profile.types';

// Reading a resume with AI takes longer than the default 15 s; the backend answers within 30 s.
const PARSE_TIMEOUT_MS = 35000;

const asResumeError = (error: unknown) =>
  new ResumeError(error instanceof ApiError ? toResumeErrorCode(error.data) : 'unknown');

const uploadResume = async (file: PickedResume) => {
  const target = toResumeUploadTarget(await api.post('/profile/resume/upload-url'));
  await uploadToPresignedPost(target.url, target.fields, { uri: file.uri, name: file.name, type: 'application/pdf' });
  return target.fileKey;
};

export const profileService = {
  getProfile: async () => toProfile(await api.get('/profile')),
  importResume: async (file: PickedResume) => {
    try {
      const fileKey = await uploadResume(file);
      return toProfile(await api.post('/profile/resume/parse', toParseResumeRequest(fileKey, file), { timeout: PARSE_TIMEOUT_MS }));
    } catch (error) {
      throw asResumeError(error);
    }
  },
  getResumeDownload: async () => toResumeDownload(await api.get('/profile/resume/download-url')),
};
