import { useInfiniteQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobsService';
import type { JobListFilters, JobSort } from '../types/jobs.types';
import { jobsKeys } from './jobsKeys';

interface JobListingsOptions {
  enabled?: boolean;
  sort?: JobSort;
}

export const useJobListings = (filters: JobListFilters, { enabled = true, sort }: JobListingsOptions = {}) =>
  useInfiniteQuery({
    enabled,
    queryKey: jobsKeys.listings(filters, sort),
    queryFn: ({ pageParam }) => jobsService.listJobs(filters, pageParam, sort),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.pageSize < lastPage.total ? lastPage.page + 1 : undefined,
    select: (data) => ({ jobs: data.pages.flatMap((page) => page.jobs), total: data.pages[0]?.total ?? 0 }),
  });
