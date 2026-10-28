import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobsService';
import type { JobListFilters } from '../types/jobs.types';
import { jobsKeys } from './jobsKeys';

export const useJobCount = (filters: JobListFilters, { enabled = true } = {}) =>
  useQuery({
    queryKey: jobsKeys.count(filters),
    queryFn: () => jobsService.countJobs(filters),
    placeholderData: keepPreviousData,
    enabled,
  });
