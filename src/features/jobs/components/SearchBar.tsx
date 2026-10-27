import React, { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Input } from '@/components/input';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ICON_SIZE = moderateScale(20);

interface SearchBarProps {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  clearLabel: string;
  value: string;
  onChangeText: (query: string) => void;
  isSearching?: boolean;
  error?: string | null;
  accessory?: ReactNode;
}

export default function SearchBar({
  icon,
  placeholder,
  clearLabel,
  value,
  onChangeText,
  isSearching = false,
  error = null,
  accessory,
}: SearchBarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const clearButton = value ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={clearLabel}
      hitSlop={spacing[12]}
      onPress={() => onChangeText('')}
    >
      <Ionicons name="close" size={ICON_SIZE} color={colors.iconDefault} />
    </Pressable>
  ) : null;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Input
          variant="floating"
          containerStyle={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          accessibilityLabel={placeholder}
          returnKeyType="search"
          leftIcon={<Ionicons name={icon} size={ICON_SIZE} color={colors.iconBrand} />}
          rightAccessory={isSearching ? <ActivityIndicator color={colors.iconBrand} /> : clearButton}
        />
        {accessory}
      </View>
      {error ? (
        <View style={styles.error}>
          <AppText variant="bodySmall" color="statusDanger">
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: spacing[8],
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[8],
    },
    input: {
      flex: 1,
      marginBottom: 0,
    },
    error: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing[12],
      paddingVertical: spacing[8],
      borderRadius: radius.md,
      backgroundColor: colors.bgCanvas,
    },
  });
