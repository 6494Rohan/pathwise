import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/typography';
import { spacing } from '@/theme';

interface AuthFooterLinkProps {
  prompt: string;
  action: string;
  onPress: () => void;
  disabled?: boolean;
}

const hitSlop = spacing[8];

export default function AuthFooterLink({ prompt, action, onPress, disabled = false }: AuthFooterLinkProps) {
  return (
    <View style={styles.row}>
      <AppText variant="bodySmall">{prompt}</AppText>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={action}
        accessibilityState={{ disabled }}
        hitSlop={hitSlop}
        disabled={disabled}
        onPress={onPress}
        style={disabled && styles.disabled}
      >
        <AppText variant="labelMedium" color="textBrand">
          {action}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
  },
  disabled: {
    opacity: 0.4,
  },
});
