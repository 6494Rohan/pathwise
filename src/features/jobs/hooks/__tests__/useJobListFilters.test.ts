import { act, renderHook } from '@testing-library/react-native';
import { useJobListFilters } from '../useJobListFilters';

describe('useJobListFilters', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('starts with no filters', async () => {
    const { result } = await renderHook(() => useJobListFilters());

    expect(result.current.activeCount).toBe(0);
    expect(Object.values(result.current.filters).every((value) => value === undefined)).toBe(true);
  });

  it('turns quick filters on and off, one age bucket at a time', async () => {
    const { result } = await renderHook(() => useJobListFilters());

    await act(async () => {
      result.current.toggleVerified();
      result.current.toggleLast24Hours();
      result.current.togglePostedAge('3-7');
    });
    expect(result.current.filters).toEqual(
      expect.objectContaining({ verifiedOnly: true, last24Hours: true, postedAge: '3-7' })
    );
    expect(result.current.activeCount).toBe(3);

    await act(async () => {
      result.current.togglePostedAge('7-15');
      result.current.toggleLast24Hours();
    });
    expect(result.current.filters.postedAge).toBe('7-15');
    expect(result.current.filters.last24Hours).toBeUndefined();

    await act(async () => result.current.togglePostedAge('7-15'));
    expect(result.current.filters.postedAge).toBeUndefined();
  });

  it('applies the filter sheet and clears everything except the search', async () => {
    const { result } = await renderHook(() => useJobListFilters());

    await act(async () => {
      result.current.setSearch('react');
      result.current.applyAdvanced({ experienceYears: 2, skillSlugs: ['react'], companyIds: ['c1'] });
    });
    await act(async () => jest.advanceTimersByTime(400));
    expect(result.current.filters).toEqual(
      expect.objectContaining({ search: 'react', experienceYears: 2, skillSlugs: ['react'], companyIds: ['c1'] })
    );
    expect(result.current.activeCount).toBe(3);

    await act(async () => result.current.clearAll());
    expect(result.current.activeCount).toBe(0);
    expect(result.current.filters.search).toBe('react');
  });

  it('waits for a pause in typing before searching', async () => {
    const { result } = await renderHook(() => useJobListFilters());

    await act(async () => result.current.setSearch('  dev '));
    expect(result.current.search).toBe('  dev ');
    expect(result.current.filters.search).toBeUndefined();

    await act(async () => jest.advanceTimersByTime(400));
    expect(result.current.filters.search).toBe('dev');
  });
});
