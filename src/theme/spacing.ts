import { moderateScale } from '@/utils/scaling';

export const spacing = {
  2: moderateScale(2),
  4: moderateScale(4),
  6: moderateScale(6),
  8: moderateScale(8),
  12: moderateScale(12),
  16: moderateScale(16),
  20: moderateScale(20),
  24: moderateScale(24),
  32: moderateScale(32),
} as const;
