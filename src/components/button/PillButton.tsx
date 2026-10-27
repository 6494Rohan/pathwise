import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { AppText } from '../typography';

interface PillButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
}

export default function PillButton({ title, ...pressableProps }: PillButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
      {...pressableProps}
    >
      <AppText variant="labelMedium" color="textBrand">
        {title}
      </AppText>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pill: {
      paddingHorizontal: spacing[16],
      paddingVertical: spacing[6],
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderBrand,
      backgroundColor: colors.bgCanvas,
    },
    pressed: {
      backgroundColor: colors.bgBrandSubtle,
    },
  });
