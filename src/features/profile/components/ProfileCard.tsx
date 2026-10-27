import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { radius, ThemeColors, useTheme } from '@/theme';

interface ProfileCardProps {
  children: ReactNode;
}

export default function ProfileCard({ children }: ProfileCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return <View style={styles.card}>{children}</View>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
      overflow: 'hidden',
    },
  });
