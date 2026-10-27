import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/input';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ICON_SIZE = moderateScale(20);

interface LocationSearchBarProps {
  value: string;
  onChangeText: (query: string) => void;
  isSearching: boolean;
  error: string | null;
}

export default function LocationSearchBar({ value, onChangeText, isSearching, error }: LocationSearchBarProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const clearButton = value ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('search.clear')}
      hitSlop={spacing[12]}
      onPress={() => onChangeText('')}
    >
      <Ionicons name="close" size={ICON_SIZE} color={colors.iconDefault} />
    </Pressable>
  ) : null;

  return (
    <View style={styles.container}>
      <Input
        variant="floating"
        containerStyle={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={t('search.placeholder')}
        accessibilityLabel={t('search.placeholder')}
        returnKeyType="search"
        leftIcon={<Ionicons name="location-outline" size={ICON_SIZE} color={colors.iconBrand} />}
        rightAccessory={isSearching ? <ActivityIndicator color={colors.iconBrand} /> : clearButton}
      />
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
    input: {
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
