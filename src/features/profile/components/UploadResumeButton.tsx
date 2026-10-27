import React from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PillButton } from '@/components/button';

export default function UploadResumeButton() {
  const { t } = useTranslation(['profile', 'common']);

  return <PillButton title={t('uploadResume')} onPress={() => Alert.alert(t('uploadResume'), t('common:comingSoon'))} />;
}
