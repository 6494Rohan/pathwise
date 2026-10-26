import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeColors, useTheme } from '@/theme';

interface SafeAreaScreenProps extends ViewProps {
  edges?: readonly Edge[];
}

const DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom'];

export default function SafeAreaScreen({ edges = DEFAULT_EDGES, style, ...viewProps }: SafeAreaScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return <SafeAreaView edges={edges} style={[styles.container, style]} {...viewProps} />;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgCanvas,
    },
  });
