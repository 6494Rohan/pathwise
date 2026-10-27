export const jobsKeys = {
  all: ['jobs'] as const,
  mapCompanies: () => [...jobsKeys.all, 'mapCompanies'] as const,
  companyJobs: (companyId: string) => [...jobsKeys.all, 'companyJobs', companyId] as const,
  placeSearch: (query: string) => [...jobsKeys.all, 'placeSearch', query] as const,
};
