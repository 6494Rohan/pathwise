import { toJobPostings, toMapCompanies } from '../acl/jobsMapper';
import { dummyCompanyJobsResponse, dummyMapCompaniesResponse } from './dummyJobsData';

// Dummy data until the jobs API exists: replace `respond(...)` with `api.get(...)`; the mappers stay.
const DUMMY_LATENCY_MS = 400;
const respond = (data: unknown) => new Promise<unknown>((resolve) => setTimeout(() => resolve(data), DUMMY_LATENCY_MS));

export const jobsService = {
  getMapCompanies: async () => toMapCompanies(await respond(dummyMapCompaniesResponse)),
  getCompanyJobs: async (companyId: string) => toJobPostings(await respond(dummyCompanyJobsResponse(companyId))),
};
