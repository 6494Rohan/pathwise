import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/theme';
import { AppText } from '../typography';

export default function ComingSoon() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppText variant="body" color="textSecondary">
        {t('comingSoon')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[24],
  },
});
