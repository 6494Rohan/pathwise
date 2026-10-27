import React, { ReactNode, Ref } from 'react';
import { StyleSheet, TextInput, TextInputInstance, TextInputProps, View } from 'react-native';
import { radius, spacing, ThemeColors, typography, useTheme } from '@/theme';
import { AppText } from '../typography';

interface InputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  errorTestID?: string;
  leftIcon?: ReactNode;
  rightAccessory?: ReactNode;
  ref?: Ref<TextInputInstance>;
}

export default function Input({ error, errorTestID, leftIcon, rightAccessory, ref, ...inputProps }: InputProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={[styles.field, error ? styles.fieldError : undefined, inputProps.editable === false && styles.fieldDisabled]}>
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing[12],
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      backgroundColor: colors.bgMuted,
      borderWidth: 1,
      borderColor: colors.bgMuted,
      borderRadius: radius.md,
      paddingHorizontal: spacing[16],
    },
    fieldError: {
      borderColor: colors.statusDanger,
    },
    fieldDisabled: {
      opacity: 0.6,
    },
    input: {
      ...typography.body,
      flex: 1,
      color: colors.textPrimary,
      paddingVertical: spacing[12],
    },
    errorText: {
      marginTop: spacing[4],
    },
  });
