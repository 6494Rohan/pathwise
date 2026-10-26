import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from './colors';

export const useTheme = () => {
  const isDark = useColorScheme() === 'dark';
  return { colors: isDark ? darkColors : lightColors, isDark };
};
