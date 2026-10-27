import React from 'react';
import { DimensionValue, StyleSheet, View } from 'react-native';
import { radius, spacing, ThemeColors, typography, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ACTION_ICON_SIZE = moderateScale(20);
const META_ICON_SIZE = moderateScale(16);
const VERIFIED_ICON_SIZE = moderateScale(18);

// Mirrors JobListingCard's layout and text heights so nothing jumps when the real card replaces it.
export default function JobListingCardSkeleton() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const bar = (width: DimensionValue, lineHeight: number) => (
    <View style={[styles.bar, { width, height: lineHeight * 0.7, marginVertical: lineHeight * 0.15 }]} />
  );

  return (
    <View
      testID="job-card-skeleton"
      style={styles.card}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      <View style={styles.titleRow}>
        <View style={styles.titleWithBadge}>
          {bar('60%', typography.titleCard.lineHeight)}
          <View style={[styles.circle, { width: VERIFIED_ICON_SIZE, height: VERIFIED_ICON_SIZE }]} />
        </View>
        <View style={[styles.icon, { width: ACTION_ICON_SIZE, height: ACTION_ICON_SIZE }]} />
        <View style={[styles.icon, { width: ACTION_ICON_SIZE, height: ACTION_ICON_SIZE }]} />
      </View>
      {bar('40%', typography.bodySmall.lineHeight)}
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <View style={[styles.circle, { width: META_ICON_SIZE, height: META_ICON_SIZE }]} />
          {bar(spacing[32] * 2, typography.bodySmall.lineHeight)}
        </View>
        <View style={styles.meta}>
          <View style={[styles.circle, { width: META_ICON_SIZE, height: META_ICON_SIZE }]} />
          {bar(spacing[32] * 1.5, typography.caption.lineHeight)}
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
      alignItems: 'center',
      gap: spacing[12],
    },
    titleWithBadge: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[6],
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
    bar: {
      borderRadius: radius.sm,
      backgroundColor: colors.bgMuted,
    },
    circle: {
      borderRadius: radius.full,
      backgroundColor: colors.bgMuted,
    },
    icon: {
      borderRadius: radius.sm,
      backgroundColor: colors.bgMuted,
    },
  });
