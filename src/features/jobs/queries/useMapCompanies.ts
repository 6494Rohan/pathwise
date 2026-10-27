import { useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobsService';
import { jobsKeys } from './jobsKeys';

export const useMapCompanies = () =>
  useQuery({
    queryKey: jobsKeys.mapCompanies(),
    queryFn: jobsService.getMapCompanies,
  });
