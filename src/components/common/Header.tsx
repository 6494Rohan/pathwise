import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, ThemeColors, useTheme } from '@/theme';
import { AppText } from '../typography';

interface HeaderProps {
  title: string;
  titleAccessory?: ReactNode;
  right?: ReactNode;
}

export default function Header({ title, titleAccessory, right }: HeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: top + spacing[12] }]}>
      <View style={styles.titleRow}>
        <AppText variant="heading1" accessibilityRole="header">
          {title}
        </AppText>
        {titleAccessory}
      </View>
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
    titleRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[8],
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
    },
  });
