import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';

interface ClusterPinProps {
  companyCount: number;
}

export default function ClusterPin({ companyCount }: ClusterPinProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.pin}>
      <AppText variant="labelSmall" color="textOnBrand" maxFontSizeMultiplier={1.3}>
        {companyCount}
      </AppText>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pin: {
      minWidth: spacing[24],
      minHeight: spacing[24],
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[6],
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: colors.bgCanvas,
      backgroundColor: colors.bgBrand,
    },
  });
