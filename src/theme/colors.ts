// The splash stays brand indigo in both modes; app.config.ts uses the same hex for the native splash.
export const SPLASH_BACKGROUND = '#4F46E5';

export const lightColors = {
  bgBrand: '#4F46E5',
  bgSplash: SPLASH_BACKGROUND,
  bgBrandSubtle: '#EEF2FF',
  bgBrandSoft: '#E0E7FF',
  bgBrandPressed: '#4338CA',
  textBrand: '#4F46E5',
  borderBrand: '#4F46E5',
  iconBrand: '#4F46E5',

  bgCanvas: '#FFFFFF',
  bgSubtle: '#F8FAFC',
  bgMuted: '#F1F5F9',
  bgScrim: '#0F172A',
  bgSheet: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textOnBrand: '#FFFFFF',
  borderDefault: '#E2E8F0',
  borderStrong: '#CBD5E1',
  iconDefault: '#334155',
  iconMuted: '#64748B',
  iconOnBrand: '#FFFFFF',

  statusSuccess: '#059669',
  statusSuccessBg: '#ECFDF5',
  statusWarning: '#F59E0B',
  statusWarningBg: '#FFFBEB',
  statusDanger: '#E11D48',
  statusDangerBg: '#FFF1F2',
  accentViolet: '#7C3AED',
  accentVioletBg: '#F5F3FF',
  accentTeal: '#0D9488',
  accentTealBg: '#F0FDFA',
};

export type ThemeColors = typeof lightColors;
export type ColorName = keyof ThemeColors;

// Not in the design file yet: mirrors the light roles with Tailwind Slate/Indigo dark shades.
export const darkColors: ThemeColors = {
  bgBrand: '#6366F1',
  bgSplash: SPLASH_BACKGROUND,
  bgBrandSubtle: '#1E1B4B',
  bgBrandSoft: '#312E81',
  bgBrandPressed: '#4F46E5',
  textBrand: '#A5B4FC',
  borderBrand: '#818CF8',
  iconBrand: '#818CF8',

  bgCanvas: '#020617',
  bgSubtle: '#0F172A',
  bgMuted: '#1E293B',
  bgScrim: '#020617',
  bgSheet: '#0F172A',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textOnBrand: '#FFFFFF',
  borderDefault: '#1E293B',
  borderStrong: '#334155',
  iconDefault: '#CBD5E1',
  iconMuted: '#94A3B8',
  iconOnBrand: '#FFFFFF',

  statusSuccess: '#34D399',
  statusSuccessBg: '#022C22',
  statusWarning: '#FBBF24',
  statusWarningBg: '#451A03',
  statusDanger: '#FB7185',
  statusDangerBg: '#4C0519',
  accentViolet: '#A78BFA',
  accentVioletBg: '#2E1065',
  accentTeal: '#2DD4BF',
  accentTealBg: '#042F2E',
};
