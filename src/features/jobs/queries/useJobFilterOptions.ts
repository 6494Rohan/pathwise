import { useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobsService';
import { jobsKeys } from './jobsKeys';

const FIVE_MINUTES = 5 * 60 * 1000;

export const useJobFilterOptions = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: jobsKeys.filterOptions(),
    queryFn: jobsService.getFilterOptions,
    staleTime: FIVE_MINUTES,
    enabled,
  });
