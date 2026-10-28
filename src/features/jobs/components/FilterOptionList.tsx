import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import SearchBar from './SearchBar';

const CHECKBOX_SIZE = moderateScale(20);
const CHECK_ICON_SIZE = moderateScale(14);
const MAX_VISIBLE = 50;

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterOptionListProps {
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  search?: { placeholder: string; clearLabel: string; noMatches: string };
  scrollable?: boolean;
}

export default function FilterOptionList({ options, selected, onToggle, search, scrollable = false }: FilterOptionListProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const visible = (needle ? options.filter((option) => option.label.toLowerCase().includes(needle)) : options).slice(
    0,
    MAX_VISIBLE
  );

  const rows = visible.map((option) => {
    const checked = selected.includes(option.value);
    return (
      <Pressable
        key={option.value}
        accessibilityRole="checkbox"
        accessibilityLabel={option.label}
        accessibilityState={{ checked }}
        onPress={() => onToggle(option.value)}
        style={styles.row}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked ? <Ionicons name="checkmark" size={CHECK_ICON_SIZE} color={colors.iconOnBrand} /> : null}
        </View>
        <AppText variant="body" style={styles.label}>
          {option.label}
        </AppText>
        {option.count !== undefined ? (
          <AppText variant="labelMedium" color="textSecondary">
            {option.count.toLocaleString()}
          </AppText>
        ) : null}
      </Pressable>
    );
  });

  return (
    <View style={[styles.list, scrollable && styles.fill]}>
      {search ? (
        <View style={styles.search}>
          <SearchBar
            icon="search"
            placeholder={search.placeholder}
            clearLabel={search.clearLabel}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      ) : null}
      {search && needle && visible.length === 0 ? (
        <AppText variant="bodySmall" color="textSecondary" style={styles.empty}>
          {search.noMatches}
        </AppText>
      ) : null}
      {scrollable ? (
        <ScrollView style={styles.fill} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {rows}
        </ScrollView>
      ) : (
        rows
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    list: {
      gap: spacing[2],
    },
    fill: {
      flex: 1,
    },
    search: {
      flexDirection: 'row',
      marginBottom: spacing[8],
    },
    empty: {
      paddingVertical: spacing[12],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      paddingVertical: spacing[12],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderDefault,
    },
    checkbox: {
      width: CHECKBOX_SIZE,
      height: CHECKBOX_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: radius.sm / 2,
      borderColor: colors.borderStrong,
    },
    checkboxChecked: {
      borderColor: colors.borderBrand,
      backgroundColor: colors.bgBrand,
    },
    label: {
      flex: 1,
    },
  });
