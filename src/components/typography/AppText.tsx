import React from 'react';
import { Text, TextProps } from 'react-native';
import { ColorName, textColors, typography, TypographyVariant, useTheme } from '@/theme';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: ColorName;
}

export default function AppText({ variant = 'body', color, style, ...textProps }: AppTextProps) {
  const { colors } = useTheme();
  const textColor = { color: colors[color ?? textColors[variant]] };

  return <Text style={[typography[variant], textColor, style]} {...textProps} />;
}
