import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import type { JobsViewMode } from '../types/jobs.types';

const ICON_SIZE = moderateScale(18);

const MODES: { mode: JobsViewMode; icon: keyof typeof Ionicons.glyphMap }[] = [
  { mode: 'list', icon: 'list' },
  { mode: 'map', icon: 'location' },
];

interface ViewModeToggleProps {
  value: JobsViewMode;
  onChange: (mode: JobsViewMode) => void;
  style?: ViewStyle;
}

export default function ViewModeToggle({ value, onChange, style }: ViewModeToggleProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.toggle, style]}>
      {MODES.map(({ mode, icon }) => {
        const isSelected = mode === value;
        return (
          <Pressable
            key={mode}
            accessibilityRole="button"
            accessibilityLabel={t(`viewMode.${mode}`)}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(mode)}
            style={[styles.option, isSelected && styles.optionSelected]}
          >
            <Ionicons name={icon} size={ICON_SIZE} color={isSelected ? colors.iconOnBrand : colors.iconMuted} />
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    toggle: {
      flexDirection: 'row',
      gap: spacing[2],
      padding: spacing[4],
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
    // Every option keeps a background: Android drops the corner radius when one is added later.
    option: {
      paddingHorizontal: spacing[12],
      paddingVertical: spacing[6],
      borderRadius: radius.full,
      backgroundColor: colors.bgCanvas,
    },
    optionSelected: {
      backgroundColor: colors.bgBrand,
    },
  });
