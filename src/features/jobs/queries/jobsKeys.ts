import type { JobListFilters, JobSort } from '../types/jobs.types';

export const jobsKeys = {
  all: ['jobs'] as const,
  listings: (filters: JobListFilters, sort?: JobSort) => [...jobsKeys.all, 'listings', filters, sort ?? null] as const,
  count: (filters: JobListFilters) => [...jobsKeys.all, 'count', filters] as const,
  filterOptions: () => [...jobsKeys.all, 'filterOptions'] as const,
  mapCompanies: (filters: JobListFilters) => [...jobsKeys.all, 'mapCompanies', filters] as const,
  placeSearch: (query: string) => [...jobsKeys.all, 'placeSearch', query] as const,
};
