import { useMemo, useState } from 'react';
import { useSearchPlace } from '../queries/useSearchPlace';
import { LocationError, LocationErrorCode } from '../types/jobs.types';
import { useDebouncedValue } from './useDebouncedValue';

const TYPING_PAUSE_MS = 600;
const MIN_QUERY_LENGTH = 3;

const toShownErrorCode = (error: Error | null): Exclude<LocationErrorCode, 'notFound'> | null => {
  if (!error) return null;
  if (!(error instanceof LocationError)) return 'unknown';
  return error.code === 'notFound' ? null : error.code;
};

export const usePlaceSearch = () => {
  const [query, setQuery] = useState('');
  const pausedQuery = useDebouncedValue(query.trim(), TYPING_PAUSE_MS);
  const searchedQuery = pausedQuery.length >= MIN_QUERY_LENGTH ? pausedQuery : '';
  const search = useSearchPlace(searchedQuery);

  const searchedPlace = useMemo(
    () => (search.data ? { name: searchedQuery, coordinate: search.data } : null),
    [search.data, searchedQuery]
  );

  return {
    query,
    setQuery,
    searchedPlace,
    isSearching: search.isFetching,
    errorCode: toShownErrorCode(search.error),
  };
};
