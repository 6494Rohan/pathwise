import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, ThemeColors, useTheme } from '@/theme';
import { AppText } from '../typography';

interface HeaderProps {
  title: string;
  right?: ReactNode;
}

export default function Header({ title, right }: HeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: top + spacing[12] }]}>
      <AppText variant="heading1" accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      {right ? <View style={styles.actions}>{right}</View> : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      paddingHorizontal: spacing[16],
      paddingBottom: spacing[12],
      backgroundColor: colors.bgCanvas,
    },
    title: {
      flex: 1,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
    },
  });
