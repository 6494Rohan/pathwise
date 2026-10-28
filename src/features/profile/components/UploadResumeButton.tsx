import React from 'react';
import { useTranslation } from 'react-i18next';
import { PillButton } from '@/components/button';
import { useResumeImport } from '../hooks/useResumeImport';
import { useProfile } from '../queries/useProfile';

export default function UploadResumeButton() {
  const { t } = useTranslation('profile');
  const { start, isImporting } = useResumeImport();
  const hasResume = useProfile().data?.resume != null;

  // Once a resume is saved, replacing it lives on the Profile tab's resume card.
  if (hasResume && !isImporting) return null;

  return (
    <PillButton
      title={isImporting ? t('resume.importing') : t('uploadResume')}
      disabled={isImporting}
      accessibilityState={{ busy: isImporting, disabled: isImporting }}
      onPress={start}
    />
  );
}
