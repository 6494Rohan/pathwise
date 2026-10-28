import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import ProfileCard from './ProfileCard';

const ICON_SIZE = moderateScale(20);

interface LanguageRowProps {
  languageName: string;
  onPress: () => void;
}

export default function LanguageRow({ languageName, onPress }: LanguageRowProps) {
  const { t } = useTranslation('profile');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ProfileCard>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('language.label')}
        accessibilityValue={{ text: languageName }}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <Ionicons name="language-outline" size={ICON_SIZE} color={colors.iconMuted} />
        <AppText variant="bodyMedium" style={styles.label}>
          {t('language.label')}
        </AppText>
        <AppText variant="body" color="textSecondary">
          {languageName}
        </AppText>
        <Ionicons name="chevron-forward" size={ICON_SIZE} color={colors.iconMuted} />
      </Pressable>
    </ProfileCard>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      padding: spacing[16],
    },
    pressed: {
      backgroundColor: colors.bgSubtle,
    },
    label: {
      flex: 1,
    },
  });
