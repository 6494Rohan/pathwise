import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';

interface EnvironmentCardProps {
  appVariant: string;
  apiUrl?: string;
}

export default function EnvironmentCard({ appVariant, apiUrl }: EnvironmentCardProps) {
  const { t } = useTranslation('home');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <AppText variant="titleCard" style={styles.label}>
        {t('environment')}
      </AppText>
      <AppText variant="code" style={styles.value}>
        EXPO_PUBLIC_APP_VARIANT: {appVariant}
      </AppText>
      <AppText variant="code" style={styles.value}>
        EXPO_PUBLIC_API_URL: {apiUrl ?? 'not set'}
      </AppText>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.bgSubtle,
      padding: spacing[16],
      borderRadius: radius.md,
    },
    label: {
      marginBottom: spacing[12],
    },
    value: {
      marginBottom: spacing[8],
    },
  });
