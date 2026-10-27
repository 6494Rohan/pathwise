import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { spacing, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import GoogleIcon from './GoogleIcon';
import SocialButton from './SocialButton';

interface SocialSignInButtonsProps {
  onGooglePress: () => void;
  googleLoading: boolean;
  disabled: boolean;
}

export default function SocialSignInButtons({ onGooglePress, googleLoading, disabled }: SocialSignInButtonsProps) {
  const { t } = useTranslation('auth');
  const { colors } = useTheme();
  const iconSize = moderateScale(22);

  return (
    <View style={styles.container}>
      <SocialButton
        title={t('continueWithGoogle')}
        icon={<GoogleIcon size={iconSize} />}
        onPress={onGooglePress}
        loading={googleLoading}
        disabled={disabled}
      />
      <SocialButton
        title={t('continueWithApple')}
        icon={<Ionicons name="logo-apple" size={iconSize} color={colors.textPrimary} />}
        disabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[12],
  },
});
