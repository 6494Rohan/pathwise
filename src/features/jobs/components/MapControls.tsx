import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ICON_SIZE = moderateScale(22);

interface MapControlsProps {
  isLocating: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
}

export default function MapControls({ isLocating, onZoomIn, onZoomOut, onLocate }: MapControlsProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const controls = [
    { key: 'zoomIn', label: t('map.zoomIn'), onPress: onZoomIn, icon: <Ionicons name="add" size={ICON_SIZE} color={colors.iconDefault} /> },
    { key: 'zoomOut', label: t('map.zoomOut'), onPress: onZoomOut, icon: <Ionicons name="remove" size={ICON_SIZE} color={colors.iconDefault} /> },
    {
      key: 'locate',
      label: t('map.myLocation'),
      onPress: onLocate,
      icon: isLocating ? (
        <ActivityIndicator color={colors.iconBrand} />
      ) : (
        <Ionicons name="locate" size={ICON_SIZE} color={colors.iconBrand} />
      ),
    },
  ];

  return (
    <View style={styles.controls}>
      {controls.map(({ key, label, onPress, icon }) => (
        <Pressable
          key={key}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ busy: key === 'locate' && isLocating }}
          disabled={key === 'locate' && isLocating}
          onPress={onPress}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          {icon}
        </Pressable>
      ))}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    controls: {
      gap: spacing[12],
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[8],
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
    pressed: {
      backgroundColor: colors.bgMuted,
    },
  });
