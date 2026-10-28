import { useTranslation } from 'react-i18next';
import type { JobFilterSection } from '../types/jobs.types';
import type { AdvancedJobFilters } from './useJobListFilters';

export interface QuickFilterDropdown {
  section: JobFilterSection;
  label: string;
  selected: boolean;
}

export const useQuickFilterDropdowns = (advanced: AdvancedJobFilters): QuickFilterDropdown[] => {
  const { t } = useTranslation('jobs');

  const fromValues = (section: JobFilterSection, values: string[], showsSingleValue: boolean): QuickFilterDropdown => {
    const title = t(`filters.${section}`);
    if (values.length === 0) return { section, label: title, selected: false };
    const label =
      showsSingleValue && values.length === 1 ? values[0] : t('filters.sectionCount', { title, count: values.length });
    return { section, label, selected: true };
  };

  return [
    fromValues('location', advanced.cities, true),
    { section: 'country', label: t('filters.india'), selected: true },
    fromValues('jobTitle', advanced.titles, true),
    fromValues('company', advanced.companyIds, false),
    advanced.postedAge
      ? { section: 'aging', label: t(`filters.age.${advanced.postedAge}`), selected: true }
      : { section: 'aging', label: t('filters.aging'), selected: false },
    fromValues('skills', advanced.skillSlugs, false),
  ];
};
