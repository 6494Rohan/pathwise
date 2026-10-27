import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { radius, spacing, ThemeColors, typography, useTheme } from '@/theme';
import JobListingCardSkeleton from './JobListingCardSkeleton';
import SkeletonPulse from './SkeletonPulse';

interface JobListSkeletonProps {
  cardCount: number;
  withHeader?: boolean;
}

export default function JobListSkeleton({ cardCount, withHeader = false }: JobListSkeletonProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SkeletonPulse label={t('list.loading')}>
      <View style={styles.list}>
        {withHeader ? (
          <View style={styles.header}>
            <View style={[styles.bar, styles.count]} />
            <View style={[styles.bar, styles.sort]} />
          </View>
        ) : null}
        {Array.from({ length: cardCount }, (_, index) => (
          <JobListingCardSkeleton key={index} />
        ))}
      </View>
    </SkeletonPulse>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    list: {
      gap: spacing[12],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bar: {
      borderRadius: radius.sm,
      backgroundColor: colors.bgMuted,
    },
    count: {
      width: '30%',
      height: typography.heading3.lineHeight * 0.75,
    },
    sort: {
      width: '25%',
      height: typography.labelMedium.lineHeight * 0.75,
    },
  });
