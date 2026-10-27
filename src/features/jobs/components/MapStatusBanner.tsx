import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';

type MapStatusBannerProps = { status: 'loading' } | { status: 'error'; onRetry: () => void };

export default function MapStatusBanner(props: MapStatusBannerProps) {
  const { t } = useTranslation(['jobs', 'common']);
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.banner}>
      {props.status === 'loading' ? (
        <>
          <ActivityIndicator color={colors.iconBrand} />
          <AppText variant="bodySmall">{t('map.loading')}</AppText>
        </>
      ) : (
        <>
          <AppText variant="bodySmall" color="statusDanger" style={styles.message}>
            {t('map.loadError')}
          </AppText>
          <Button title={t('common:actions.retry')} variant="secondary" onPress={props.onRetry} />
        </>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    banner: {
      position: 'absolute',
      bottom: spacing[16],
      left: spacing[16],
      right: spacing[16],
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      padding: spacing[12],
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
    message: {
      flex: 1,
    },
  });
