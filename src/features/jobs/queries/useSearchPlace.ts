import { skipToken, useQuery } from '@tanstack/react-query';
import { locationService } from '../services/locationService';
import { jobsKeys } from './jobsKeys';

export const useSearchPlace = (query: string) =>
  useQuery({
    queryKey: jobsKeys.placeSearch(query),
    queryFn: query ? () => locationService.searchPlace(query) : skipToken,
    staleTime: Infinity,
    retry: false,
  });
