import React, { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

interface SocialButtonProps {
  title: string;
  icon: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function SocialButton({ title, icon, onPress, disabled = false, loading = false }: SocialButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && !loading && styles.disabled]}
    >
      <View style={styles.icon}>{icon}</View>
      <AppText variant="labelLarge" style={styles.title}>
        {title}
      </AppText>
      {loading ? (
        <ActivityIndicator color={colors.iconMuted} />
      ) : (
        <Ionicons name="chevron-forward" size={moderateScale(18)} color={colors.iconMuted} />
      )}
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      paddingVertical: spacing[12],
      paddingHorizontal: spacing[16],
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
    pressed: {
      backgroundColor: colors.bgSubtle,
    },
    disabled: {
      opacity: 0.4,
    },
    icon: {
      width: moderateScale(24),
      alignItems: 'center',
    },
    title: {
      flex: 1,
      textAlign: 'center',
    },
  });
