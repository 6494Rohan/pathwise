import { useMemo, useReducer } from 'react';
import type { JobListFilters, PostedAge } from '../types/jobs.types';
import { useDebouncedValue } from './useDebouncedValue';

const TYPING_PAUSE_MS = 400;

export interface AdvancedJobFilters {
  cities: string[];
  titles: string[];
  companyIds: string[];
  experienceYears?: number;
  postedAge?: PostedAge;
  skillSlugs: string[];
}

export const NO_ADVANCED_FILTERS: AdvancedJobFilters = { cities: [], titles: [], companyIds: [], skillSlugs: [] };

interface JobListFiltersState extends AdvancedJobFilters {
  search: string;
  verifiedOnly: boolean;
  last24Hours: boolean;
  lastWeek: boolean;
}

type JobListFiltersAction =
  | { type: 'setSearch'; search: string }
  | { type: 'toggleVerified' }
  | { type: 'toggleLast24Hours' }
  | { type: 'toggleLastWeek' }
  | { type: 'applyAdvanced'; advanced: AdvancedJobFilters }
  | { type: 'clearAll' };

const initialState: JobListFiltersState = {
  ...NO_ADVANCED_FILTERS,
  search: '',
  verifiedOnly: false,
  last24Hours: false,
  lastWeek: false,
};

const reducer = (state: JobListFiltersState, action: JobListFiltersAction): JobListFiltersState => {
  switch (action.type) {
    case 'setSearch':
      return { ...state, search: action.search };
    case 'toggleVerified':
      return { ...state, verifiedOnly: !state.verifiedOnly };
    case 'toggleLast24Hours':
      return { ...state, last24Hours: !state.last24Hours };
    case 'toggleLastWeek':
      return { ...state, lastWeek: !state.lastWeek };
    case 'applyAdvanced':
      return { ...state, ...action.advanced };
    case 'clearAll':
      return { ...initialState, search: state.search };
  }
};

const nonEmpty = (values: string[]) => (values.length ? values : undefined);

const toListFilters = (state: JobListFiltersState, search: string): JobListFilters => ({
  search: search || undefined,
  verifiedOnly: state.verifiedOnly || undefined,
  last24Hours: state.last24Hours || undefined,
  lastWeek: state.lastWeek || undefined,
  postedAge: state.postedAge,
  experienceYears: state.experienceYears,
  cities: nonEmpty(state.cities),
  titles: nonEmpty(state.titles),
  skillSlugs: nonEmpty(state.skillSlugs),
  companyIds: nonEmpty(state.companyIds),
});

export const useJobListFilters = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const search = useDebouncedValue(state.search.trim(), TYPING_PAUSE_MS);

  const filters = useMemo(() => toListFilters(state, search), [search, state]);

  const activeCount = [
    state.verifiedOnly,
    state.last24Hours,
    state.lastWeek,
    state.postedAge !== undefined,
    state.experienceYears !== undefined,
    state.cities.length > 0,
    state.titles.length > 0,
    state.skillSlugs.length > 0,
    state.companyIds.length > 0,
  ].filter(Boolean).length;

  return {
    search: state.search,
    verifiedOnly: state.verifiedOnly,
    last24Hours: state.last24Hours,
    lastWeek: state.lastWeek,
    advanced: {
      cities: state.cities,
      titles: state.titles,
      companyIds: state.companyIds,
      experienceYears: state.experienceYears,
      postedAge: state.postedAge,
      skillSlugs: state.skillSlugs,
    },
    filters,
    activeCount,
    withAdvanced: (advanced: AdvancedJobFilters) => toListFilters({ ...state, ...advanced }, search),
    setSearch: (value: string) => dispatch({ type: 'setSearch', search: value }),
    toggleVerified: () => dispatch({ type: 'toggleVerified' }),
    toggleLast24Hours: () => dispatch({ type: 'toggleLast24Hours' }),
    toggleLastWeek: () => dispatch({ type: 'toggleLastWeek' }),
    applyAdvanced: (advanced: AdvancedJobFilters) => dispatch({ type: 'applyAdvanced', advanced }),
    clearAll: () => dispatch({ type: 'clearAll' }),
  };
};
