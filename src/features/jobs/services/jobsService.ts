import { api } from '@/services/api';
import {
  toJobFilterOptions,
  toJobFilterParams,
  toJobListingsPage,
  toJobsQueryParams,
  toMapCompanies,
} from '../acl/jobsMapper';
import type { JobListFilters, JobSort } from '../types/jobs.types';

export const JOBS_PAGE_SIZE = 20;

export const jobsService = {
  listJobs: async (filters: JobListFilters, page: number, sort?: JobSort) =>
    toJobListingsPage(await api.get('/jobs', { params: toJobsQueryParams(filters, page, JOBS_PAGE_SIZE, sort) })),
  getMapCompanies: async (filters: JobListFilters) =>
    toMapCompanies(await api.get('/jobs/map', { params: toJobFilterParams(filters) })),
  getFilterOptions: async () => toJobFilterOptions(await api.get('/jobs/filters')),
};
