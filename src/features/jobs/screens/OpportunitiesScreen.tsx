import React, { useRef, useState } from 'react';
import { Alert, Share, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ComingSoon, SafeAreaScreen } from '@/components/common';
import { env } from '@/config/env';
import { spacing } from '@/theme';
import CompanyJobsSheet from '../components/CompanyJobsSheet';
import JobFiltersSheet from '../components/JobFiltersSheet';
import JobList from '../components/JobList';
import JobsMap, { JobsMapHandle } from '../components/JobsMap';
import JobsSectionTabs from '../components/JobsSectionTabs';
import KeyboardSteadyView from '../components/KeyboardSteadyView';
import MapControls from '../components/MapControls';
import MapStatusBanner from '../components/MapStatusBanner';
import QuickFilters from '../components/QuickFilters';
import SearchBar from '../components/SearchBar';
import SortSheet from '../components/SortSheet';
import ViewModeToggle from '../components/ViewModeToggle';
import { useJobListFilters } from '../hooks/useJobListFilters';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import { useCurrentLocation } from '../queries/useCurrentLocation';
import { useJobFilterOptions } from '../queries/useJobFilterOptions';
import { useJobListings } from '../queries/useJobListings';
import { useMapCompanies } from '../queries/useMapCompanies';
import { JobListing, JobSort, JobsSection, JobsViewMode, LocationError, MapCompany } from '../types/jobs.types';

const NO_COMPANIES: MapCompany[] = [];
const ZOOM_STEP = 2;

export default function OpportunitiesScreen() {
  const { t } = useTranslation(['jobs', 'common']);
  const [section, setSection] = useState<JobsSection>('allJobs');
  const [viewMode, setViewMode] = useState<JobsViewMode>('map');
  const [selectedCompany, setSelectedCompany] = useState<MapCompany | null>(null);
  const [isFiltersSheetOpen, setFiltersSheetOpen] = useState(false);
  const [sort, setSort] = useState<JobSort>('newest');
  const [isSortSheetOpen, setSortSheetOpen] = useState(false);
  const jobFilters = useJobListFilters();
  const { filters } = jobFilters;
  const isAllJobs = section === 'allJobs';
  const showsMap = isAllJobs && viewMode === 'map';
  const showsList = isAllJobs && viewMode === 'list';

  const companies = useMapCompanies(filters);
  const listings = useJobListings(filters, { enabled: showsList, sort });
  const companyJobs = useJobListings(
    selectedCompany ? { ...filters, companyIds: [selectedCompany.companyId], city: selectedCompany.city } : filters,
    { enabled: selectedCompany !== null }
  );
  const filterOptions = useJobFilterOptions({ enabled: isFiltersSheetOpen });
  const placeSearch = usePlaceSearch();
  const currentLocation = useCurrentLocation();
  const mapRef = useRef<JobsMapHandle>(null);

  const locate = () =>
    currentLocation.mutate(undefined, {
      onSuccess: (coordinate) => mapRef.current?.flyTo(coordinate),
      onError: (error) =>
        Alert.alert(t(`locate.errors.${error instanceof LocationError && error.code === 'permissionDenied' ? 'permissionDenied' : 'unknown'}`)),
    });

  // The job id is in the path (`/jobs/<id>`, mapped in navigation/linking.ts) so the link can open that job.
  const shareJob = (job: JobListing) => {
    const url = env.EXPO_PUBLIC_WEB_URL ? new URL(`/jobs/${encodeURIComponent(job.id)}`, env.EXPO_PUBLIC_WEB_URL).toString() : '';
    Share.share({ message: t('jobActions.shareMessage', { title: job.title, company: job.company.name, url }) });
  };
  const saveJob = () => Alert.alert(t('common:comingSoon'));

  const toggle = <ViewModeToggle value={viewMode} onChange={setViewMode} />;

  return (
    <SafeAreaScreen edges={[]}>
      <JobsSectionTabs selected={section} onSelect={setSection} />
      <View style={styles.content}>
        {showsMap ? (
          <KeyboardSteadyView>
            <JobsMap
              ref={mapRef}
              companies={companies.data ?? NO_COMPANIES}
              onCompanyPress={setSelectedCompany}
              searchedPlace={placeSearch.searchedPlace}
              showsUserLocation={currentLocation.isSuccess}
            />
            {companies.isPending ? <MapStatusBanner status="loading" /> : null}
            {companies.isError ? <MapStatusBanner status="error" onRetry={() => companies.refetch()} /> : null}
          </KeyboardSteadyView>
        ) : showsList ? (
          <View style={styles.list}>
            <View style={styles.listSearch}>
              <SearchBar
                icon="search"
                placeholder={t('jobSearch.placeholder')}
                clearLabel={t('jobSearch.clear')}
                value={jobFilters.search}
                onChangeText={jobFilters.setSearch}
                accessory={toggle}
              />
            </View>
            <QuickFilters
              activeCount={jobFilters.activeCount}
              verifiedOnly={jobFilters.verifiedOnly}
              last24Hours={jobFilters.last24Hours}
              postedAge={jobFilters.postedAge}
              onOpenFilters={() => setFiltersSheetOpen(true)}
              onToggleVerified={jobFilters.toggleVerified}
              onToggleLast24Hours={jobFilters.toggleLast24Hours}
              onTogglePostedAge={jobFilters.togglePostedAge}
            />
            <JobList
              jobs={listings.data?.jobs ?? []}
              total={listings.data?.total ?? 0}
              isLoading={listings.isPending}
              isError={listings.isError}
              isRefreshing={listings.isRefetching && !listings.isFetchingNextPage}
              isLoadingMore={listings.isFetchingNextPage}
              onLoadMore={() => {
                if (listings.hasNextPage && !listings.isFetchingNextPage) listings.fetchNextPage();
              }}
              onRefresh={() => listings.refetch()}
              onRetry={() => listings.refetch()}
              onShareJob={shareJob}
              onSaveJob={saveJob}
              sort={sort}
              onOpenSort={() => setSortSheetOpen(true)}
            />
          </View>
        ) : (
          <ComingSoon />
        )}
        {showsMap ? (
          <View style={styles.overlay} pointerEvents="box-none">
            <View style={styles.topRow} pointerEvents="box-none">
              <SearchBar
                icon="location-outline"
                placeholder={t('search.placeholder')}
                clearLabel={t('search.clear')}
                value={placeSearch.query}
                onChangeText={placeSearch.setQuery}
                isSearching={placeSearch.isSearching}
                error={placeSearch.errorCode ? t(`search.errors.${placeSearch.errorCode}`) : null}
                accessory={toggle}
              />
            </View>
            <View style={styles.mapControls}>
              <MapControls
                isLocating={currentLocation.isPending}
                onZoomIn={() => mapRef.current?.zoomBy(1 / ZOOM_STEP)}
                onZoomOut={() => mapRef.current?.zoomBy(ZOOM_STEP)}
                onLocate={locate}
              />
            </View>
          </View>
        ) : null}
      </View>
      <CompanyJobsSheet
        company={selectedCompany}
        jobs={companyJobs.data?.jobs}
        isLoading={companyJobs.isPending}
        isError={companyJobs.isError}
        isLoadingMore={companyJobs.isFetchingNextPage}
        onLoadMore={() => {
          if (companyJobs.hasNextPage && !companyJobs.isFetchingNextPage) companyJobs.fetchNextPage();
        }}
        onRetry={() => companyJobs.refetch()}
        onClose={() => setSelectedCompany(null)}
        onShareJob={shareJob}
        onSaveJob={saveJob}
      />
      <SortSheet
        visible={isSortSheetOpen}
        value={sort}
        onChange={(next) => {
          setSort(next);
          setSortSheetOpen(false);
        }}
        onClose={() => setSortSheetOpen(false)}
      />
      <JobFiltersSheet
        visible={isFiltersSheetOpen}
        initial={jobFilters.advanced}
        options={filterOptions.data}
        onApply={(advanced) => {
          jobFilters.applyAdvanced(advanced);
          setFiltersSheetOpen(false);
        }}
        onClose={() => setFiltersSheetOpen(false)}
      />
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
    gap: spacing[12],
  },
  listSearch: {
    flexDirection: 'row',
    paddingTop: spacing[12],
    paddingHorizontal: spacing[16],
  },
  overlay: {
    position: 'absolute',
    top: spacing[12],
    left: spacing[16],
    right: spacing[16],
    gap: spacing[12],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: spacing[8],
  },
  mapControls: {
    alignSelf: 'flex-end',
  },
});
