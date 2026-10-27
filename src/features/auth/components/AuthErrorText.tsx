import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { AuthFailure } from '../types/auth.types';

interface AuthErrorTextProps {
  error: Error | null;
}

export default function AuthErrorText({ error }: AuthErrorTextProps) {
  const { t } = useTranslation('auth');
  if (!error) return null;

  const code = error instanceof AuthFailure ? error.code : 'unknown';
  return (
    <AppText variant="bodySmall" color="statusDanger" accessibilityRole="alert">
      {t(`errors.${code}`)}
    </AppText>
  );
}
