import { darkColors, FONT_FAMILY, lightColors, radius, spacing, textColors, typography } from '..';

describe('theme', () => {
  it('defines the same colors for light and dark mode', () => {
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(lightColors).sort());
  });

  it('has a spacing scale that grows step by step', () => {
    const steps = Object.values(spacing);
    expect([...steps].sort((a, b) => a - b)).toEqual(steps);
  });

  it('gives every text variant a font size and a theme color', () => {
    for (const [variant, style] of Object.entries(typography)) {
      expect(style.fontSize).toBeGreaterThan(0);
      expect(lightColors).toHaveProperty(textColors[variant as keyof typeof typography]);
    }
  });

  it('sets every design text style in Plus Jakarta Sans', () => {
    const { code, ...designStyles } = typography;
    for (const style of Object.values(designStyles)) {
      expect(style.fontFamily).toBe(FONT_FAMILY);
    }
    expect(code.fontFamily).not.toBe(FONT_FAMILY);
  });

  it('keeps pills fully rounded', () => {
    expect(radius.full).toBe(999);
  });
});
