import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { SignUpHeaderButton } from '@/features/auth';
import { spacing } from '@/theme';

export default function GuestProfilePrompt() {
  const { t } = useTranslation('profile');

  return (
    <View style={styles.prompt}>
      <AppText variant="heading2" accessibilityRole="header" style={styles.centered}>
        {t('guest.title')}
      </AppText>
      <AppText variant="body" color="textSecondary" style={styles.centered}>
        {t('guest.body')}
      </AppText>
      <SignUpHeaderButton />
    </View>
  );
}

const styles = StyleSheet.create({
  prompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[16],
    padding: spacing[24],
  },
  centered: {
    textAlign: 'center',
  },
});
