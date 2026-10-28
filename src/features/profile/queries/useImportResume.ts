import { useIsMutating, useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';
import { ResumeError, ResumeErrorCode } from '../types/profile.types';
import { profileKeys } from './profileKeys';

export const useImportResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: profileKeys.importResume(),
    mutationFn: profileService.importResume,
    onSuccess: (profile) => queryClient.setQueryData(profileKeys.me(), profile),
  });
};

// True wherever the import was started (header pill or resume card), so both show progress.
export const useIsImportingResume = () => useIsMutating({ mutationKey: profileKeys.importResume() }) > 0;

export interface ResumeImportOutcome {
  submittedAt: number;
  errorCode: ResumeErrorCode | null;
}

// The last finished import, from any screen, so the resume card can show how it went.
export const useLastResumeImport = (): ResumeImportOutcome | undefined =>
  useMutationState({
    filters: { mutationKey: profileKeys.importResume(), predicate: (mutation) => mutation.state.status !== 'pending' },
    select: (mutation) => ({
      submittedAt: mutation.state.submittedAt,
      errorCode:
        mutation.state.status === 'success'
          ? null
          : mutation.state.error instanceof ResumeError
            ? mutation.state.error.code
            : 'unknown',
    }),
  }).at(-1);
