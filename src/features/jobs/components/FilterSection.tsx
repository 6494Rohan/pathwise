import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppText } from '@/components/typography';
import { spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const CHEVRON_SIZE = moderateScale(16);

interface FilterSectionProps {
  title: string;
  summary: string;
  isSet: boolean;
  expanded: boolean;
  onToggle?: () => void;
  children?: ReactNode;
}

export default function FilterSection({ title, summary, isSet, expanded, onToggle, children }: FilterSectionProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const summaryColor = isSet ? 'textBrand' : 'textSecondary';

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole={onToggle ? 'button' : undefined}
        accessibilityLabel={`${title}, ${summary}`}
        accessibilityState={onToggle ? { expanded } : undefined}
        disabled={!onToggle}
        onPress={onToggle}
        style={styles.header}
      >
        <AppText variant="heading3" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="bodyMedium" color={summaryColor} numberOfLines={1} style={styles.summary}>
          {summary}
        </AppText>
        {onToggle ? (
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={CHEVRON_SIZE}
            color={isSet ? colors.iconBrand : colors.iconMuted}
          />
        ) : null}
      </Pressable>
      {expanded ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderDefault,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[8],
      paddingVertical: spacing[16],
    },
    title: {
      flex: 1,
    },
    summary: {
      flexShrink: 1,
    },
    body: {
      paddingBottom: spacing[12],
    },
  });
