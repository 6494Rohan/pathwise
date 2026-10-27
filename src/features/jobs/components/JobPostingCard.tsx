import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import type { JobPosting } from '../types/jobs.types';

interface JobPostingCardProps {
  job: JobPosting;
}

export default function JobPostingCard({ job }: JobPostingCardProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <AppText variant="titleCard">{job.title}</AppText>
      <AppText variant="bodySmall">
        {t('job.meta', { location: job.location, employmentType: t(`job.employmentType.${job.employmentType}`) })}
      </AppText>
      <AppText variant="labelMedium" color={job.salaryLpa ? 'textBrand' : 'textTertiary'}>
        {job.salaryLpa ? t('job.salaryLpa', job.salaryLpa) : t('job.salaryNotDisclosed')}
      </AppText>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      gap: spacing[4],
      padding: spacing[16],
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
  });
