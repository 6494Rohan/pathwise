import { act, renderHook, waitFor } from '@testing-library/react-native';
import { createQueryWrapper } from '@/test-utils/renderWithProviders';
import { jobsService } from '../../services/jobsService';
import { jobListing, mapCompany } from '../../test-utils/jobsFixtures';
import { jobsKeys } from '../jobsKeys';
import { useCurrentLocation } from '../useCurrentLocation';
import { useJobFilterOptions } from '../useJobFilterOptions';
import { useJobListings } from '../useJobListings';
import { useMapCompanies } from '../useMapCompanies';
import { useSearchPlace } from '../useSearchPlace';

jest.mock('../../services/jobsService', () => ({
  jobsService: { getMapCompanies: jest.fn(), listJobs: jest.fn(), getFilterOptions: jest.fn() },
}));

const page = (number: number, ids: string[], total: number) => ({
  jobs: ids.map((id) => jobListing({ id })),
  page: number,
  pageSize: 2,
  total,
});

describe('jobs queries', () => {
  beforeEach(() => jest.clearAllMocks());

  it('builds keys under the jobs key, including the filters', () => {
    expect(jobsKeys.mapCompanies({ verifiedOnly: true })).toEqual(['jobs', 'mapCompanies', { verifiedOnly: true }]);
    expect(jobsKeys.listings({})).toEqual(['jobs', 'listings', {}, null]);
    expect(jobsKeys.listings({}, 'salary')).toEqual(['jobs', 'listings', {}, 'salary']);
  });

  it('loads map pins for the filters', async () => {
    const pins = [mapCompany()];
    jest.mocked(jobsService.getMapCompanies).mockResolvedValue(pins);

    const { result } = await renderHook(() => useMapCompanies({ verifiedOnly: true }), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.data).toEqual(pins));
    expect(jobsService.getMapCompanies).toHaveBeenCalledWith({ verifiedOnly: true });
  });

  it('loads job listings page by page and stops at the last page', async () => {
    jest
      .mocked(jobsService.listJobs)
      .mockResolvedValueOnce(page(1, ['a', 'b'], 3))
      .mockResolvedValueOnce(page(2, ['c'], 3));

    const { result } = await renderHook(() => useJobListings({}), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.data?.jobs.map((job) => job.id)).toEqual(['a', 'b']));
    expect(result.current.hasNextPage).toBe(true);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.data?.jobs.map((job) => job.id)).toEqual(['a', 'b', 'c']));
    expect(result.current.data?.total).toBe(3);
    expect(result.current.hasNextPage).toBe(false);
    expect(jobsService.listJobs).toHaveBeenLastCalledWith({}, 2);
  });

  it('does not load listings while disabled', async () => {
    const { result } = await renderHook(() => useJobListings({}, { enabled: false }), { wrapper: createQueryWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
    expect(jobsService.listJobs).not.toHaveBeenCalled();
  });

  it('loads filter options only when asked', async () => {
    jest.mocked(jobsService.getFilterOptions).mockResolvedValue({ cities: [], titles: [], skills: [], companies: [] });

    const idle = await renderHook(() => useJobFilterOptions({ enabled: false }), { wrapper: createQueryWrapper() });
    expect(idle.result.current.fetchStatus).toBe('idle');

    const { result } = await renderHook(() => useJobFilterOptions(), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.data).toEqual({ cities: [], titles: [], skills: [], companies: [] }));
    expect(jobsKeys.filterOptions()).toEqual(['jobs', 'filterOptions']);
  });

  it('searches a place for a query, and not for an empty one', async () => {
    const { result } = await renderHook(() => useSearchPlace('Bengaluru'), { wrapper: createQueryWrapper() });
    const idle = await renderHook(() => useSearchPlace(''), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.data).toEqual({ latitude: 12.97, longitude: 77.59 }));
    expect(idle.result.current.fetchStatus).toBe('idle');
    expect(jobsKeys.placeSearch('Bengaluru')).toEqual(['jobs', 'placeSearch', 'Bengaluru']);
  });

  it('reads the current location on demand', async () => {
    const { result } = await renderHook(() => useCurrentLocation(), { wrapper: createQueryWrapper() });

    await act(async () => result.current.mutate());

    await waitFor(() => expect(result.current.data).toEqual({ latitude: 13.34, longitude: 74.74 }));
  });
});
