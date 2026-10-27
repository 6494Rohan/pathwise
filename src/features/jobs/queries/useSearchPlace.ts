import { skipToken, useQuery } from '@tanstack/react-query';
import { placeService } from '../services/placeService';
import { jobsKeys } from './jobsKeys';

export const useSearchPlace = (query: string) =>
  useQuery({
    queryKey: jobsKeys.placeSearch(query),
    queryFn: query ? () => placeService.searchPlace(query) : skipToken,
    staleTime: Infinity,
    retry: false,
  });
