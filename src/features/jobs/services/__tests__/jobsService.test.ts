import { api } from '@/services/api';
import { JOBS_PAGE_SIZE, jobsService } from '../jobsService';

jest.mock('@/services/api', () => ({ api: { get: jest.fn() } }));

describe('jobsService', () => {
  it('lists jobs from GET /jobs with the filters and page', async () => {
    jest.mocked(api.get).mockResolvedValue({ jobs: [], page: 2, page_size: JOBS_PAGE_SIZE, total: 0 });

    await expect(jobsService.listJobs({ verifiedOnly: true }, 2)).resolves.toEqual({
      jobs: [],
      page: 2,
      pageSize: JOBS_PAGE_SIZE,
      total: 0,
    });
    expect(api.get).toHaveBeenCalledWith('/jobs', { params: { verified: 'true', page: 2, pageSize: JOBS_PAGE_SIZE } });
  });

  it('loads map pins from GET /jobs/map with the same filters and no paging', async () => {
    jest.mocked(api.get).mockResolvedValue({ pins: [] });

    await expect(jobsService.getMapCompanies({ verifiedOnly: true })).resolves.toEqual([]);
    expect(api.get).toHaveBeenCalledWith('/jobs/map', { params: { verified: 'true' } });
  });

  it('loads filter options from GET /jobs/filters', async () => {
    jest.mocked(api.get).mockResolvedValue({ skills: [], companies: [] });

    await expect(jobsService.getFilterOptions()).resolves.toEqual({ skills: [], companies: [] });
    expect(api.get).toHaveBeenCalledWith('/jobs/filters');
  });

  it('rejects responses that do not match the backend shape', async () => {
    jest.mocked(api.get).mockResolvedValue({ unexpected: true });

    await expect(jobsService.listJobs({}, 1)).rejects.toThrow();
  });
});
