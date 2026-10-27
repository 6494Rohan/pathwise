import { act, renderHook } from '@testing-library/react-native';
import { useDebouncedValue } from '../useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('only takes the latest value once changes pause', async () => {
    const { result, rerender } = await renderHook(({ value }: { value: string }) => useDebouncedValue(value, 600), {
      initialProps: { value: 'B' },
    });

    await rerender({ value: 'Be' });
    await act(async () => jest.advanceTimersByTime(300));
    await rerender({ value: 'Ben' });
    await act(async () => jest.advanceTimersByTime(300));
    expect(result.current).toBe('B');

    await act(async () => jest.advanceTimersByTime(300));
    expect(result.current).toBe('Ben');
  });
});
