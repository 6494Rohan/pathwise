import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { AppText } from '@/components/typography';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ICON_SIZE = moderateScale(22);
const LABEL_MAX_FONT_SCALE = 1.3;
// The keyboard covers the gesture bar, so its inset reads 0 and then climbs back for ~300 ms after the keyboard
// closes, bouncing the bar. The gesture bar never really changes, so never go below its height at startup.
const MIN_BOTTOM_INSET = initialWindowMetrics?.insets.bottom ?? 0;

export default function AppTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const isKeyboardVisible = useKeyboardVisible();
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (isKeyboardVisible && focusedOptions.tabBarHideOnKeyboard) return null;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, MIN_BOTTOM_INSET) + spacing[8] }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : (options.title ?? route.name);

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: isFocused }}
            onPress={onPress}
            style={styles.tab}
          >
            <View style={[styles.iconPill, isFocused && styles.iconPillActive]}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? colors.iconBrand : colors.iconMuted,
                size: ICON_SIZE,
              })}
            </View>
            <AppText
              variant="labelSmall"
              color={isFocused ? 'textBrand' : 'textSecondary'}
              maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      paddingTop: spacing[8],
      backgroundColor: colors.bgCanvas,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderDefault,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      gap: spacing[4],
    },
    // Android drops the corner radius when a background is added to a view that had none, so the
    // inactive pill keeps the bar's colour and only the colour changes on focus.
    iconPill: {
      paddingHorizontal: spacing[20],
      paddingVertical: spacing[6],
      borderRadius: radius.lg,
      backgroundColor: colors.bgCanvas,
    },
    iconPillActive: {
      backgroundColor: colors.bgBrandSubtle,
    },
  });
