import React from 'react';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { spacing, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ICON_SIZE = moderateScale(22);

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

export default function IconButton({ icon, label, onPress }: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={spacing[8]} onPress={onPress}>
      <Ionicons name={icon} size={ICON_SIZE} color={colors.iconBrand} />
    </Pressable>
  );
}
