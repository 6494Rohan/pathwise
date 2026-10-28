import { useMutation } from '@tanstack/react-query';
import { profileService } from '../services/profileService';

// A mutation, not a query: each tap needs a fresh link because signed links expire after a few minutes.
export const useResumeDownload = () => useMutation({ mutationFn: profileService.getResumeDownload });
