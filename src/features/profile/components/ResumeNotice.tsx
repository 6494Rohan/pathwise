import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ICON_SIZE = moderateScale(20);
const CLOSE_ICON_SIZE = moderateScale(18);
const CLOSE_HIT_SLOP = spacing[12];

export type ResumeNoticeTone = 'success' | 'error';

interface ResumeNoticeProps {
  tone: ResumeNoticeTone;
  title: string;
  message: string;
  onDismiss: () => void;
}

const TONES = {
  success: { icon: 'checkmark-circle', color: 'statusSuccess', background: 'statusSuccessBg' },
  error: { icon: 'alert-circle', color: 'statusDanger', background: 'statusDangerBg' },
} as const;

export default function ResumeNotice({ tone, title, message, onDismiss }: ResumeNoticeProps) {
  const { t } = useTranslation('common');
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { icon, color, background } = TONES[tone];

  return (
    <View
      accessibilityRole={tone === 'error' ? 'alert' : 'summary'}
      accessibilityLiveRegion="polite"
      style={[styles.notice, { backgroundColor: colors[background], borderColor: colors[color] }]}
    >
      <Ionicons name={icon} size={ICON_SIZE} color={colors[color]} />
      <View style={styles.text}>
        <AppText variant="labelLarge" color={color}>
          {title}
        </AppText>
        <AppText variant="bodySmall" color="textSecondary">
          {message}
        </AppText>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={t('actions.dismiss')} hitSlop={CLOSE_HIT_SLOP} onPress={onDismiss}>
        <Ionicons name="close" size={CLOSE_ICON_SIZE} color={colors.iconMuted} />
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    notice: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing[12],
      padding: spacing[12],
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: colors.bgCanvas,
    },
    text: {
      flex: 1,
      gap: spacing[2],
    },
  });
