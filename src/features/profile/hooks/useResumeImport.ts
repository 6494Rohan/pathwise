import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { useImportResume, useIsImportingResume, useLastResumeImport } from '../queries/useImportResume';
import type { ResumeErrorCode } from '../types/profile.types';

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export type ResumeImportResult = { kind: 'imported' } | { kind: 'failed'; code: ResumeErrorCode };

// Pick a PDF, then upload it and let the backend fill the profile from it. `result` is the latest outcome until dismissed.
export const useResumeImport = () => {
  const importResume = useImportResume();
  const isImporting = useIsImportingResume();
  const lastImport = useLastResumeImport();
  const [pickError, setPickError] = useState<ResumeErrorCode | null>(null);
  const [dismissedAt, setDismissedAt] = useState(0);

  const start = async () => {
    if (isImporting) return;
    setPickError(null);
    const picked = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
    if (picked.canceled) return;
    const [file] = picked.assets;
    if (file.size !== undefined && file.size > MAX_RESUME_BYTES) {
      setPickError('tooLarge');
      return;
    }
    importResume.mutate({ uri: file.uri, name: file.name });
  };

  const dismiss = () => {
    setPickError(null);
    setDismissedAt(lastImport?.submittedAt ?? 0);
  };

  const result: ResumeImportResult | null = pickError
    ? { kind: 'failed', code: pickError }
    : !isImporting && lastImport && lastImport.submittedAt > dismissedAt
      ? lastImport.errorCode
        ? { kind: 'failed', code: lastImport.errorCode }
        : { kind: 'imported' }
      : null;

  return { start, isImporting, result, dismiss };
};
