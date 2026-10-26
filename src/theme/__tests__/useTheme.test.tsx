import { renderHook } from '@testing-library/react-native';
import { darkColors, lightColors, useNavigationTheme, useTheme } from '..';

const mockColorScheme = jest.fn(() => 'light');
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => mockColorScheme(),
}));

describe('useTheme', () => {
  afterEach(() => mockColorScheme.mockReturnValue('light'));

  it('uses the light palette in light mode', async () => {
    mockColorScheme.mockReturnValue('light');
    const { result } = await renderHook(() => useTheme());

    expect(result.current).toEqual({ colors: lightColors, isDark: false });
  });

  it('uses the dark palette in dark mode', async () => {
    mockColorScheme.mockReturnValue('dark');
    const { result } = await renderHook(() => useTheme());

    expect(result.current).toEqual({ colors: darkColors, isDark: true });
  });

  it('gives navigation the matching colors', async () => {
    mockColorScheme.mockReturnValue('dark');
    const { result } = await renderHook(() => useNavigationTheme());

    expect(result.current.dark).toBe(true);
    expect(result.current.colors).toMatchObject({
      background: darkColors.bgCanvas,
      text: darkColors.textPrimary,
      primary: darkColors.textBrand,
    });
  });
});
