import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { radius, spacing, ThemeColors, typography, useTheme } from '@/theme';
import { AppText } from '../typography';

interface InputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  errorTestID?: string;
}

export default function Input({ error, errorTestID, ...inputProps }: InputProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined]}
        placeholderTextColor={colors.textSecondary}
        {...inputProps}
      />
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
    input: {
      ...typography.body,
      color: colors.textPrimary,
      backgroundColor: colors.bgSubtle,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      borderRadius: radius.md,
      paddingVertical: spacing[12],
      paddingHorizontal: spacing[12],
    },
    inputError: {
      borderColor: colors.statusDanger,
    },
    errorText: {
      marginTop: spacing[4],
    },
  });
