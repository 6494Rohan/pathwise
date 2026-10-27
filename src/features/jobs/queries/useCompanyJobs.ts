import { skipToken, useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobsService';
import { jobsKeys } from './jobsKeys';

export const useCompanyJobs = (companyId: string | null) =>
  useQuery({
    queryKey: jobsKeys.companyJobs(companyId ?? ''),
    queryFn: companyId ? () => jobsService.getCompanyJobs(companyId) : skipToken,
  });
