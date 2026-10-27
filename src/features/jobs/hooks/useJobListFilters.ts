import { useMemo, useReducer } from 'react';
import type { JobListFilters, PostedAge } from '../types/jobs.types';
import { useDebouncedValue } from './useDebouncedValue';

const TYPING_PAUSE_MS = 400;

export interface AdvancedJobFilters {
  experienceYears?: number;
  skillSlugs: string[];
  companyIds: string[];
}

interface JobListFiltersState extends AdvancedJobFilters {
  search: string;
  verifiedOnly: boolean;
  last24Hours: boolean;
  postedAge?: PostedAge;
}

type JobListFiltersAction =
  | { type: 'setSearch'; search: string }
  | { type: 'toggleVerified' }
  | { type: 'toggleLast24Hours' }
  | { type: 'togglePostedAge'; postedAge: PostedAge }
  | { type: 'applyAdvanced'; advanced: AdvancedJobFilters }
  | { type: 'clearAll' };

const initialState: JobListFiltersState = {
  search: '',
  verifiedOnly: false,
  last24Hours: false,
  skillSlugs: [],
  companyIds: [],
};

const reducer = (state: JobListFiltersState, action: JobListFiltersAction): JobListFiltersState => {
  switch (action.type) {
    case 'setSearch':
      return { ...state, search: action.search };
    case 'toggleVerified':
      return { ...state, verifiedOnly: !state.verifiedOnly };
    case 'toggleLast24Hours':
      return { ...state, last24Hours: !state.last24Hours };
    case 'togglePostedAge':
      return { ...state, postedAge: state.postedAge === action.postedAge ? undefined : action.postedAge };
    case 'applyAdvanced':
      return { ...state, ...action.advanced };
    case 'clearAll':
      return { ...initialState, search: state.search };
  }
};

export const useJobListFilters = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const search = useDebouncedValue(state.search.trim(), TYPING_PAUSE_MS);

  const filters = useMemo<JobListFilters>(
    () => ({
      search: search || undefined,
      verifiedOnly: state.verifiedOnly || undefined,
      last24Hours: state.last24Hours || undefined,
      postedAge: state.postedAge,
      experienceYears: state.experienceYears,
      skillSlugs: state.skillSlugs.length ? state.skillSlugs : undefined,
      companyIds: state.companyIds.length ? state.companyIds : undefined,
    }),
    [search, state]
  );

  const activeCount = [
    state.verifiedOnly,
    state.last24Hours,
    state.postedAge !== undefined,
    state.experienceYears !== undefined,
    state.skillSlugs.length > 0,
    state.companyIds.length > 0,
  ].filter(Boolean).length;

  return {
    search: state.search,
    verifiedOnly: state.verifiedOnly,
    last24Hours: state.last24Hours,
    postedAge: state.postedAge,
    advanced: { experienceYears: state.experienceYears, skillSlugs: state.skillSlugs, companyIds: state.companyIds },
    filters,
    activeCount,
    setSearch: (value: string) => dispatch({ type: 'setSearch', search: value }),
    toggleVerified: () => dispatch({ type: 'toggleVerified' }),
    toggleLast24Hours: () => dispatch({ type: 'toggleLast24Hours' }),
    togglePostedAge: (postedAge: PostedAge) => dispatch({ type: 'togglePostedAge', postedAge }),
    applyAdvanced: (advanced: AdvancedJobFilters) => dispatch({ type: 'applyAdvanced', advanced }),
    clearAll: () => dispatch({ type: 'clearAll' }),
  };
};
