import { act, renderHook } from '@testing-library/react-native';
import i18n from '@/i18n';
import { useLanguage } from '../useLanguage';

describe('useLanguage', () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('returns the current language and changes it', async () => {
    const { result } = await renderHook(() => useLanguage());
    expect(result.current.language).toBe('en');

    await act(async () => {
      await result.current.changeLanguage('hi');
    });

    expect(result.current.language).toBe('hi');
  });
});
