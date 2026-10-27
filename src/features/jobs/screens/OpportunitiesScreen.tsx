import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ComingSoon, SafeAreaScreen } from '@/components/common';
import { spacing } from '@/theme';
import CompanyJobsSheet from '../components/CompanyJobsSheet';
import JobsMap from '../components/JobsMap';
import JobsSectionTabs from '../components/JobsSectionTabs';
import KeyboardSteadyView from '../components/KeyboardSteadyView';
import LocationSearchBar from '../components/LocationSearchBar';
import MapStatusBanner from '../components/MapStatusBanner';
import ViewModeToggle from '../components/ViewModeToggle';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import { useCompanyJobs } from '../queries/useCompanyJobs';
import { useMapCompanies } from '../queries/useMapCompanies';
import type { JobsSection, JobsViewMode, MapCompany } from '../types/jobs.types';

const NO_COMPANIES: MapCompany[] = [];

export default function OpportunitiesScreen() {
  const { t } = useTranslation('jobs');
  const [section, setSection] = useState<JobsSection>('allJobs');
  const [viewMode, setViewMode] = useState<JobsViewMode>('map');
  const [selectedCompany, setSelectedCompany] = useState<MapCompany | null>(null);
  const companies = useMapCompanies();
  const companyJobs = useCompanyJobs(selectedCompany?.id ?? null);
  const placeSearch = usePlaceSearch();
  const isAllJobs = section === 'allJobs';
  const showsMap = isAllJobs && viewMode === 'map';

  return (
    <SafeAreaScreen edges={[]}>
      <JobsSectionTabs selected={section} onSelect={setSection} />
      <View style={styles.content}>
        {showsMap ? (
          <KeyboardSteadyView>
            <JobsMap
              companies={companies.data ?? NO_COMPANIES}
              onCompanyPress={setSelectedCompany}
              searchedPlace={placeSearch.searchedPlace}
            />
            {companies.isPending ? <MapStatusBanner status="loading" /> : null}
            {companies.isError ? <MapStatusBanner status="error" onRetry={() => companies.refetch()} /> : null}
          </KeyboardSteadyView>
        ) : (
          <ComingSoon />
        )}
        {isAllJobs ? (
          <View style={styles.controls}>
            {showsMap ? (
              <LocationSearchBar
                value={placeSearch.query}
                onChangeText={placeSearch.setQuery}
                isSearching={placeSearch.isSearching}
                error={placeSearch.errorCode ? t(`search.errors.${placeSearch.errorCode}`) : null}
              />
            ) : null}
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </View>
        ) : null}
      </View>
      <CompanyJobsSheet
        company={selectedCompany}
        jobs={companyJobs.data}
        isLoading={companyJobs.isPending}
        isError={companyJobs.isError}
        onRetry={() => companyJobs.refetch()}
        onClose={() => setSelectedCompany(null)}
      />
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: spacing[12],
    left: spacing[16],
    right: spacing[16],
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: spacing[8],
  },
});
