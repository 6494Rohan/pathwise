import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import type { JobListing } from '../types/jobs.types';

const ACTION_ICON_SIZE = moderateScale(20);
const META_ICON_SIZE = moderateScale(16);
const VERIFIED_ICON_SIZE = moderateScale(18);
const HOUR_MS = 60 * 60 * 1000;

interface JobListingCardProps {
  job: JobListing;
  onShare: (job: JobListing) => void;
  onSave: (job: JobListing) => void;
}

const postedAgo = (postedAt: Date) => {
  const hours = Math.floor((Date.now() - postedAt.getTime()) / HOUR_MS);
  if (hours < 1) return { key: 'job.postedJustNow' as const, count: 0 };
  if (hours < 24) return { key: 'job.postedHoursAgo' as const, count: hours };
  return { key: 'job.postedDaysAgo' as const, count: Math.floor(hours / 24) };
};

export default function JobListingCard({ job, onShare, onSave }: JobListingCardProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const posted = postedAgo(job.postedAt);
  const postedText = t(posted.key, { count: posted.count });

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.titleWithBadge}>
          <AppText variant="titleCard" numberOfLines={2} style={styles.title}>
            {job.title}
          </AppText>
          {job.company.isVerified ? (
            <Ionicons
              name="checkmark-circle"
              size={VERIFIED_ICON_SIZE}
              color={colors.iconBrand}
              accessibilityLabel={t('job.verified')}
              accessibilityRole="image"
            />
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('jobActions.share', { title: job.title })}
          hitSlop={spacing[8]}
          onPress={() => onShare(job)}
        >
          <Ionicons name="share-social-outline" size={ACTION_ICON_SIZE} color={colors.iconMuted} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('jobActions.save', { title: job.title })}
          hitSlop={spacing[8]}
          onPress={() => onSave(job)}
        >
          <Ionicons name="bookmark-outline" size={ACTION_ICON_SIZE} color={colors.iconMuted} />
        </Pressable>
      </View>
      <AppText variant="bodySmall">{job.company.name}</AppText>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={META_ICON_SIZE} color={colors.iconMuted} />
          <AppText variant="bodySmall" color="textSecondary" style={styles.metaText}>
            {job.distanceKm !== null ? t('job.distanceKm', { distance: job.distanceKm }) : job.city}
          </AppText>
        </View>
        <View style={styles.meta} accessibilityLabel={t('jobActions.postedAt', { when: postedText })}>
          <Ionicons name="time-outline" size={META_ICON_SIZE} color={colors.iconMuted} />
          <AppText variant="caption">{postedText}</AppText>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      gap: spacing[4],
      padding: spacing[16],
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing[12],
    },
    titleWithBadge: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[6],
    },
    title: {
      flexShrink: 1,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[12],
      marginTop: spacing[8],
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[4],
    },
    metaText: {
      flexShrink: 1,
    },
  });
