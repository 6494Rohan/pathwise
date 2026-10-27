import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button';
import { useSignOut } from '../queries/useSignOut';

interface SignOutButtonProps {
  style?: StyleProp<ViewStyle>;
}

export default function SignOutButton({ style }: SignOutButtonProps) {
  const { t } = useTranslation('auth');
  const signOut = useSignOut();

  return (
    <Button
      title={t('signOut')}
      variant="secondary"
      loading={signOut.isPending}
      onPress={() => signOut.mutate()}
      style={style}
    />
  );
}
