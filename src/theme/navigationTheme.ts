import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { useTheme } from './useTheme';

export const useNavigationTheme = (): Theme => {
  const { colors, isDark } = useTheme();
  const base = isDark ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.textBrand,
      background: colors.bgCanvas,
      card: colors.bgCanvas,
      text: colors.textPrimary,
      border: colors.borderDefault,
      notification: colors.statusDanger,
    },
  };
};
