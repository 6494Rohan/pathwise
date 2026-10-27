import React from 'react';
import { StyleSheet, View } from 'react-native';
import JobsIcon from '@/assets/icons/tabs/jobs.svg';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ICON_SIZE = moderateScale(14);

interface CompanyPinProps {
  openJobCount: number;
}

export default function CompanyPin({ openJobCount }: CompanyPinProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.pin}>
      <JobsIcon color={colors.iconBrand} width={ICON_SIZE} height={ICON_SIZE} />
      <AppText variant="labelSmall" color="textPrimary" maxFontSizeMultiplier={1.3}>
        {openJobCount}
      </AppText>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pin: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[4],
      paddingHorizontal: spacing[8],
      paddingVertical: spacing[4],
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.bgCanvas,
    },
  });
