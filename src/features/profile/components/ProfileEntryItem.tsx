import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { spacing } from '@/theme';
import type { ProfileEntry } from '../types/profile.types';

interface ProfileEntryItemProps {
  entry: ProfileEntry;
}

const formatMonth = (yearMonth: string, locale: string) => {
  const [year, month] = yearMonth.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(new Date(year, month - 1));
};

export default function ProfileEntryItem({ entry }: ProfileEntryItemProps) {
  const { t, i18n } = useTranslation('profile');
  const start = formatMonth(entry.startMonth, i18n.language);
  const end = entry.endMonth ? formatMonth(entry.endMonth, i18n.language) : t('period.present');

  return (
    <View style={styles.entry}>
      <AppText variant="titleCard">{entry.title}</AppText>
      <AppText variant="bodySmall">{entry.subtitle}</AppText>
      <AppText variant="caption">{t('period.range', { start, end })}</AppText>
      {entry.description ? <AppText variant="body">{entry.description}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    gap: spacing[4],
  },
});
