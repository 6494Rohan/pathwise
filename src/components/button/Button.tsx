import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ColorName, radius, spacing, ThemeColors, useTheme } from '@/theme';
import { AppText } from '../typography';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const labelColors: Record<ButtonVariant, ColorName> = {
  primary: 'textOnBrand',
  secondary: 'textBrand',
};

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...pressableProps
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const isDisabled = Boolean(disabled || loading);
  const accessibilityState = { disabled: isDisabled, busy: loading };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={accessibilityState}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles[`${variant}Pressed`],
        isDisabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={colors[labelColors[variant]]} />
      ) : (
        <AppText variant="labelLarge" color={labelColors[variant]}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    base: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing[12],
      paddingHorizontal: spacing[20],
      borderRadius: radius.md,
    },
    primary: {
      backgroundColor: colors.bgBrand,
    },
    primaryPressed: {
      backgroundColor: colors.bgBrandPressed,
    },
    secondary: {
      backgroundColor: colors.bgSubtle,
      borderWidth: 1,
      borderColor: colors.borderDefault,
    },
    secondaryPressed: {
      opacity: 0.7,
    },
    disabled: {
      opacity: 0.4,
    },
  });
