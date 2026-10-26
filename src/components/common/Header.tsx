import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing, ThemeColors, useTheme } from '@/theme';
import { AppText } from '../typography';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.header}>
      <AppText variant="heading2">{title}</AppText>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      padding: spacing[16],
      backgroundColor: colors.bgCanvas,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderDefault,
    },
  });
