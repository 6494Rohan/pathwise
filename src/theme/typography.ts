import { Platform, TextStyle } from 'react-native';
import { fontScale } from '@/utils/scaling';
import type { ColorName } from './colors';

export const FONT_FAMILY = 'Plus Jakarta Sans';

type FontWeight = '400' | '500' | '600' | '700' | '800';

interface DesignTextStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeight;
  letterSpacing: number;
}

const textStyle = (fontSize: number, lineHeight: number, fontWeight: FontWeight, letterSpacing = 0): DesignTextStyle => ({
  fontFamily: FONT_FAMILY,
  fontSize: fontScale(fontSize),
  lineHeight: fontScale(lineHeight),
  fontWeight,
  letterSpacing,
});

export const typography = {
  displaySheet: textStyle(26, 32, '800', -0.4),
  heading1: textStyle(22, 28, '700', -0.3),
  heading2: textStyle(18, 24, '700', -0.2),
  heading3: textStyle(16, 22, '700', -0.1),
  titleCard: textStyle(15, 21, '600', -0.1),
  body: textStyle(14, 20, '400'),
  bodyMedium: textStyle(14, 20, '500'),
  bodySmall: textStyle(13, 18, '400'),
  labelLarge: textStyle(14, 20, '600'),
  labelMedium: textStyle(13, 18, '600'),
  labelSmall: textStyle(12, 16, '500'),
  caption: textStyle(11, 14, '500', 0.1),
  code: {
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

export const textColors: Record<TypographyVariant, ColorName> = {
  displaySheet: 'textPrimary',
  heading1: 'textPrimary',
  heading2: 'textPrimary',
  heading3: 'textPrimary',
  titleCard: 'textPrimary',
  body: 'textPrimary',
  bodyMedium: 'textPrimary',
  bodySmall: 'textSecondary',
  labelLarge: 'textPrimary',
  labelMedium: 'textPrimary',
  labelSmall: 'textSecondary',
  caption: 'textTertiary',
  code: 'textPrimary',
};
