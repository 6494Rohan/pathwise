import React from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button';
import { AppText } from '@/components/typography';
import { spacing, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import type { JobListing, JobSort } from '../types/jobs.types';
import JobListingCard from './JobListingCard';
import JobListSkeleton from './JobListSkeleton';

const CHEVRON_SIZE = moderateScale(16);
const SKELETON_CARDS = 5;

interface JobListProps {
  jobs: JobListing[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  onRetry: () => void;
  onShareJob: (job: JobListing) => void;
  onSaveJob: (job: JobListing) => void;
  sort: JobSort;
  onOpenSort: () => void;
}

export default function JobList({
  jobs,
  total,
  isLoading,
  isError,
  isRefreshing,
  isLoadingMore,
  onLoadMore,
  onRefresh,
  onRetry,
  onShareJob,
  onSaveJob,
  sort,
  onOpenSort,
}: JobListProps) {
  const { t, i18n } = useTranslation(['jobs', 'common']);
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={styles.content}>
        <JobListSkeleton cardCount={SKELETON_CARDS} withHeader />
      </View>
    );
  }

  if (isError && !jobs.length) {
    return (
      <View style={styles.status}>
        <AppText variant="body" color="statusDanger">
          {t('list.loadError')}
        </AppText>
        <Button title={t('common:actions.retry')} variant="secondary" onPress={onRetry} />
      </View>
    );
  }

  return (
    <FlatList
      testID="job-list"
      data={jobs}
      keyExtractor={(job) => job.id}
      renderItem={({ item }) => <JobListingCard job={item} onShare={onShareJob} onSave={onSaveJob} />}
      contentContainerStyle={styles.content}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.iconBrand} />}
      ListHeaderComponent={
        jobs.length ? (
          <View style={styles.header}>
            <AppText variant="heading3" accessibilityRole="header">
              {t('listHeader.count', { count: new Intl.NumberFormat(i18n.language).format(total) })}
            </AppText>
            <Pressable
              accessibilityRole="button"
              hitSlop={spacing[8]}
              onPress={onOpenSort}
              style={styles.sort}
            >
              <AppText variant="labelMedium" color="textBrand">
                {t('listHeader.sortLabel', { option: t(`listHeader.sortOptions.${sort}`) })}
              </AppText>
              <Ionicons name="chevron-down" size={CHEVRON_SIZE} color={colors.iconBrand} />
            </Pressable>
          </View>
        ) : undefined
      }
      ListEmptyComponent={<AppText variant="body" style={styles.empty}>{t('list.empty')}</AppText>}
      ListFooterComponent={isLoadingMore ? <JobListSkeleton cardCount={1} /> : undefined}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[12],
    paddingHorizontal: spacing[16],
    paddingBottom: spacing[16],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[12],
  },
  status: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[12],
    padding: spacing[24],
  },
  sort: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  empty: {
    textAlign: 'center',
    paddingVertical: spacing[24],
  },
});
