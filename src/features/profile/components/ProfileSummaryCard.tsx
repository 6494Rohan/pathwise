import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale, scale } from '@/utils/scaling';
import IconButton from './IconButton';
import ProfileCard from './ProfileCard';

const AVATAR_SIZE = scale(56);
const ICON_SIZE = moderateScale(18);
const AVATAR_ICON_SIZE = moderateScale(28);

interface ProfileSummaryCardProps {
  name: string | null;
  email: string | null;
  currentRole: string | null;
  location: string | null;
  preferredLocations: string[];
  onEdit: () => void;
}

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

export default function ProfileSummaryCard({
  name,
  email,
  currentRole,
  location,
  preferredLocations,
  onEdit,
}: ProfileSummaryCardProps) {
  const { t } = useTranslation('profile');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ProfileCard>
      <View style={styles.identity}>
        <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no">
          {name ? (
            <AppText variant="heading3" color="textOnBrand">
              {initialsOf(name)}
            </AppText>
          ) : (
            <Ionicons name="person" size={AVATAR_ICON_SIZE} color={colors.iconOnBrand} />
          )}
        </View>
        <View style={styles.nameBlock}>
          <AppText variant="heading2" accessibilityRole="header" color={name ? 'textPrimary' : 'textTertiary'}>
            {name ?? t('summary.noName')}
          </AppText>
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={ICON_SIZE} color={colors.iconMuted} />
            <AppText variant="bodySmall" style={styles.flexText}>
              {email ?? t('summary.notSet')}
            </AppText>
          </View>
        </View>
        <IconButton icon="pencil-outline" label={t('summary.editProfile')} onPress={onEdit} />
      </View>
      <View style={styles.details}>
        <View style={styles.row}>
          <Ionicons name="briefcase-outline" size={ICON_SIZE} color={colors.iconMuted} />
          <AppText variant="body" color="textSecondary" style={styles.flexText}>
            {currentRole ?? t('summary.notSet')}
          </AppText>
        </View>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={ICON_SIZE} color={colors.iconMuted} />
          <AppText variant="body" color="textSecondary" style={styles.flexText}>
            {location ?? t('summary.notSet')}
          </AppText>
        </View>
        <View style={styles.topRow}>
          <Ionicons name="navigate-circle-outline" size={ICON_SIZE} color={colors.iconMuted} />
          <View style={styles.flexText}>
            <AppText variant="bodySmall" color="textTertiary">
              {t('summary.preferredLocations')}
            </AppText>
            <AppText variant="body">{preferredLocations.length ? preferredLocations.join(', ') : t('summary.notSet')}</AppText>
          </View>
        </View>
      </View>
    </ProfileCard>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    identity: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      padding: spacing[16],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderDefault,
    },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.full,
      backgroundColor: colors.bgBrand,
    },
    nameBlock: {
      flex: 1,
      gap: spacing[4],
    },
    details: {
      gap: spacing[16],
      padding: spacing[16],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing[12],
    },
    flexText: {
      flex: 1,
    },
  });
