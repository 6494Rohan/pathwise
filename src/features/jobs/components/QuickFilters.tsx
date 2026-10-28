import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import type { QuickFilterDropdown } from '../hooks/useQuickFilterDropdowns';
import type { JobFilterSection } from '../types/jobs.types';

const ICON_SIZE = moderateScale(20);
const DOT_SIZE = spacing[6];
const CHEVRON_SIZE = moderateScale(14);

interface QuickFiltersProps {
  activeCount: number;
  verifiedOnly: boolean;
  last24Hours: boolean;
  lastWeek: boolean;
  dropdowns: QuickFilterDropdown[];
  onOpenFilters: (section?: JobFilterSection) => void;
  onToggleVerified: () => void;
  onToggleLast24Hours: () => void;
  onToggleLastWeek: () => void;
}

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function Chip({ label, selected, onPress }: ChipProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <View style={[styles.dot, selected && styles.dotSelected]} />
      <AppText variant="labelMedium" color={selected ? 'textBrand' : 'textSecondary'} maxFontSizeMultiplier={1.3}>
        {label}
      </AppText>
    </Pressable>
  );
}

function DropdownChip({ label, selected, onPress }: ChipProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.dropdownSelected]}
    >
      <AppText variant="labelMedium" color={selected ? 'textOnBrand' : 'textPrimary'} maxFontSizeMultiplier={1.3}>
        {label}
      </AppText>
      <Ionicons name="chevron-down" size={CHEVRON_SIZE} color={selected ? colors.iconOnBrand : colors.iconMuted} />
    </Pressable>
  );
}

export default function QuickFilters({
  activeCount,
  verifiedOnly,
  last24Hours,
  lastWeek,
  dropdowns,
  onOpenFilters,
  onToggleVerified,
  onToggleLast24Hours,
  onToggleLastWeek,
}: QuickFiltersProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={activeCount ? t('filters.activeCount', { count: activeCount }) : t('filters.open')}
        onPress={() => onOpenFilters()}
        style={styles.filterButton}
      >
        <Ionicons name="options-outline" size={ICON_SIZE} color={colors.iconBrand} />
        {activeCount ? (
          <View style={styles.badge}>
            <AppText variant="caption" color="textOnBrand" maxFontSizeMultiplier={1.3}>
              {activeCount}
            </AppText>
          </View>
        ) : null}
      </Pressable>
      <Chip label={t('filters.verified')} selected={verifiedOnly} onPress={onToggleVerified} />
      <Chip label={t('filters.last24Hours')} selected={last24Hours} onPress={onToggleLast24Hours} />
      <Chip label={t('filters.lastWeek')} selected={lastWeek} onPress={onToggleLastWeek} />
      {dropdowns.map((dropdown) => (
        <DropdownChip
          key={dropdown.section}
          label={dropdown.label}
          selected={dropdown.selected}
          onPress={() => onOpenFilters(dropdown.section)}
        />
      ))}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // A ScrollView grows and shrinks with spare height by default: it pushed the chips down when the list was short
    // and squashed them when it was long. The row keeps its own height.
    scroll: {
      flexGrow: 0,
      flexShrink: 0,
    },
    // Vertical padding leaves room for the badge, which sits outside the button and would be clipped by the scroll view.
    row: {
      alignItems: 'center',
      gap: spacing[8],
      paddingHorizontal: spacing[16],
      paddingVertical: spacing[6],
    },
    filterButton: {
      padding: spacing[8],
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
    badge: {
      position: 'absolute',
      top: -spacing[4],
      left: -spacing[4],
      minWidth: spacing[16],
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      borderRadius: radius.full,
      backgroundColor: colors.bgBrand,
    },
    // Every chip keeps a background: Android drops the corner radius when one is added later.
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[6],
      paddingHorizontal: spacing[12],
      paddingVertical: spacing[6],
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
    chipSelected: {
      borderColor: colors.borderBrand,
      backgroundColor: colors.bgBrandSubtle,
    },
    dropdownSelected: {
      borderColor: colors.borderBrand,
      backgroundColor: colors.bgBrand,
    },
    dot: {
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: radius.full,
      backgroundColor: colors.borderStrong,
    },
    dotSelected: {
      backgroundColor: colors.bgBrand,
    },
  });
