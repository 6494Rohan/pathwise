import { PixelRatio } from 'react-native';
import { fontScale, moderateScale, scale, verticalScale } from '../scaling';

describe('scaling', () => {
  it('never scales wider than the largest supported phone', () => {
    expect(scale(375)).toBeLessThanOrEqual(440);
  });

  it('puts moderate scaling between the design size and full scaling', () => {
    const full = scale(100);
    const moderate = moderateScale(100);

    expect(moderate).toBeGreaterThanOrEqual(Math.min(100, full));
    expect(moderate).toBeLessThanOrEqual(Math.max(100, full));
    expect(moderateScale(100, 0)).toBe(100);
  });

  it('returns whole device pixels', () => {
    for (const value of [scale(17), verticalScale(17), fontScale(17)]) {
      expect(PixelRatio.roundToNearestPixel(value)).toBe(value);
    }
  });
});
