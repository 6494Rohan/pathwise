import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { PillButton } from '@/components/button';
import type { RootStackNavigationProp } from '@/navigation/types';

export default function SignUpHeaderButton() {
  const { t } = useTranslation('auth');
  const navigation = useNavigation<RootStackNavigationProp>();

  return <PillButton title={t('headerSignUp')} onPress={() => navigation.navigate('SignUp')} />;
}
