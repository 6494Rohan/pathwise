import React, { ReactNode, Ref } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputInstance, TextInputProps, View, ViewStyle } from 'react-native';
import { radius, spacing, ThemeColors, typography, useTheme } from '@/theme';
import { AppText } from '../typography';

type InputVariant = 'filled' | 'floating';

interface InputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  errorTestID?: string;
  leftIcon?: ReactNode;
  rightAccessory?: ReactNode;
  ref?: Ref<TextInputInstance>;
  variant?: InputVariant;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function Input({
  error,
  errorTestID,
  leftIcon,
  rightAccessory,
  ref,
  variant = 'filled',
  containerStyle,
  ...inputProps
}: InputProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.field, styles[variant], error ? styles.fieldError : undefined, inputProps.editable === false && styles.fieldDisabled]}>
        {leftIcon}
        <TextInput ref={ref} style={styles.input} placeholderTextColor={colors.textTertiary} {...inputProps} />
        {rightAccessory}
      </View>
      {error ? (
        <AppText testID={errorTestID} variant="caption" color="statusDanger" style={styles.errorText}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const FIELD_PADDING = spacing[12];

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing[12],
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      borderWidth: 1,
      paddingHorizontal: spacing[16],
    },
    filled: {
      backgroundColor: colors.bgMuted,
      borderColor: colors.bgMuted,
      borderRadius: radius.md,
    },
    floating: {
      backgroundColor: colors.bgCanvas,
      borderColor: colors.borderDefault,
      borderRadius: radius.full,
    },
    fieldError: {
      borderColor: colors.statusDanger,
    },
    fieldDisabled: {
      opacity: 0.6,
    },
    // No lineHeight: on Android it makes a TextInput's text jitter while scrolling. minHeight keeps the design's
    // line box instead, so the field doesn't shrink when a password field switches to dots.
    input: {
      fontFamily: typography.body.fontFamily,
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      letterSpacing: typography.body.letterSpacing,
      includeFontPadding: false,
      textAlignVertical: 'center',
      minHeight: typography.body.lineHeight + FIELD_PADDING * 2,
      flex: 1,
      color: colors.textPrimary,
      paddingVertical: FIELD_PADDING,
    },
    errorText: {
      marginTop: spacing[4],
    },
  });
