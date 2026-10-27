import { useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobsService';
import type { JobListFilters } from '../types/jobs.types';
import { jobsKeys } from './jobsKeys';

export const useMapCompanies = (filters: JobListFilters) =>
  useQuery({
    queryKey: jobsKeys.mapCompanies(filters),
    queryFn: () => jobsService.getMapCompanies(filters),
  });
