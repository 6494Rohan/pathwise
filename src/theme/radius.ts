import { moderateScale } from '@/utils/scaling';

export const radius = {
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(24),
  full: 999,
} as const;
