import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { useProfile } from '../queries/useProfile';

export default function ProfileTitleBadge() {
  const { t } = useTranslation('profile');
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { data: profile } = useProfile();

  if (!profile) return null;

  return (
    <View style={styles.badgeRow}>
      <View style={styles.divider} />
      <AppText variant="labelLarge" color="textSecondary">
        {profile.code}
      </AppText>
      <View style={styles.badge}>
        <AppText variant="labelSmall" color="textBrand" maxFontSizeMultiplier={1.3}>
          {t(`plan.${profile.plan}`)}
        </AppText>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    badgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[8],
    },
    divider: {
      width: 1,
      alignSelf: 'stretch',
      backgroundColor: colors.borderStrong,
    },
    badge: {
      paddingHorizontal: spacing[8],
      paddingVertical: spacing[2],
      borderRadius: radius.full,
      backgroundColor: colors.bgBrandSubtle,
    },
  });
