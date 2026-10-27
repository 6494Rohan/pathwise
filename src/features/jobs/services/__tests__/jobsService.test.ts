import { dummyCompanyJobsResponse, dummyMapCompaniesResponse } from '../dummyJobsData';
import { jobsService } from '../jobsService';

describe('jobsService', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const settle = async <T>(promise: Promise<T>) => {
    await jest.runAllTimersAsync();
    return promise;
  };

  it('returns every dummy company as a map company', async () => {
    const companies = await settle(jobsService.getMapCompanies());

    expect(companies).toHaveLength(dummyMapCompaniesResponse.companies.length);
    expect(companies[0]).toEqual(
      expect.objectContaining({ id: 'c1', name: 'Tata Motors Finance', openJobCount: 4 })
    );
  });

  it("returns one posting per open job of the company", async () => {
    const jobs = await settle(jobsService.getCompanyJobs('c2'));

    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toEqual(expect.objectContaining({ id: 'c2-j1', location: 'Hebri' }));
  });

  it('returns no jobs for an unknown company', async () => {
    expect(dummyCompanyJobsResponse('missing')).toEqual({ jobs: [] });
    await expect(settle(jobsService.getCompanyJobs('missing'))).resolves.toEqual([]);
  });
});
