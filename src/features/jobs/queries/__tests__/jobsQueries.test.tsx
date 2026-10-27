import { renderHook, waitFor } from '@testing-library/react-native';
import { createQueryWrapper } from '@/test-utils/renderWithProviders';
import { jobsService } from '../../services/jobsService';
import { jobsKeys } from '../jobsKeys';
import { useCompanyJobs } from '../useCompanyJobs';
import { useMapCompanies } from '../useMapCompanies';
import { useSearchPlace } from '../useSearchPlace';

jest.mock('../../services/jobsService', () => ({
  jobsService: { getMapCompanies: jest.fn(), getCompanyJobs: jest.fn() },
}));

const company = { id: 'c1', name: 'Axis Bank', coordinate: { latitude: 13, longitude: 75 }, openJobCount: 1 };
const job = { id: 'j1', title: 'Sales Executive', location: 'Udupi', employmentType: 'fullTime', salaryLpa: null };

describe('jobs queries', () => {
  it('builds keys under the jobs key', () => {
    expect(jobsKeys.mapCompanies()).toEqual(['jobs', 'mapCompanies']);
    expect(jobsKeys.companyJobs('c1')).toEqual(['jobs', 'companyJobs', 'c1']);
  });

  it('loads the map companies', async () => {
    jest.mocked(jobsService.getMapCompanies).mockResolvedValue([company]);

    const { result } = await renderHook(() => useMapCompanies(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.data).toEqual([company]));
  });

  it("loads a company's jobs once a company is chosen", async () => {
    jest.mocked(jobsService.getCompanyJobs).mockResolvedValue([job as never]);

    const { result } = await renderHook(() => useCompanyJobs('c1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.data).toEqual([job]));
    expect(jobsService.getCompanyJobs).toHaveBeenCalledWith('c1');
  });

  it('does not fetch jobs without a company', async () => {
    jest.mocked(jobsService.getCompanyJobs).mockClear();

    const { result } = await renderHook(() => useCompanyJobs(null), { wrapper: createQueryWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
    expect(jobsService.getCompanyJobs).not.toHaveBeenCalled();
  });

  it('searches a place for a query, and not for an empty one', async () => {
    const { result } = await renderHook(() => useSearchPlace('Bengaluru'), { wrapper: createQueryWrapper() });
    const idle = await renderHook(() => useSearchPlace(''), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.data).toEqual({ latitude: 12.97, longitude: 77.59 }));
    expect(idle.result.current.fetchStatus).toBe('idle');
    expect(jobsKeys.placeSearch('Bengaluru')).toEqual(['jobs', 'placeSearch', 'Bengaluru']);
  });
});
