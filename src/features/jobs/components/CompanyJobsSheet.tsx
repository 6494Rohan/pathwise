import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/button';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import type { JobListing, MapCompany } from '../types/jobs.types';
import JobListingCard from './JobListingCard';
import JobListSkeleton from './JobListSkeleton';

const CLOSE_ICON_SIZE = moderateScale(22);
const CLOSE_HIT_SLOP = spacing[12];
const SKELETON_CARDS = 3;

interface CompanyJobsSheetProps {
  company: MapCompany | null;
  jobs: JobListing[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
  onClose: () => void;
  onShareJob: (job: JobListing) => void;
  onSaveJob: (job: JobListing) => void;
}

export default function CompanyJobsSheet({
  company,
  jobs,
  isLoading,
  isError,
  isLoadingMore,
  onLoadMore,
  onRetry,
  onClose,
  onShareJob,
  onSaveJob,
}: CompanyJobsSheetProps) {
  const { t } = useTranslation(['jobs', 'common']);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal visible={company !== null} transparent animationType="slide" navigationBarTranslucent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('sheet.close')} />
      <View style={[styles.sheet, { paddingBottom: bottom + spacing[16] }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View style={styles.titles}>
            <AppText variant="heading2" accessibilityRole="header">
              {company?.name}
            </AppText>
            <AppText variant="bodySmall">
              {t('sheet.cityOpenJobs', { city: company?.city ?? '', count: company?.openJobCount ?? 0 })}
            </AppText>
          </View>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={t('sheet.close')} hitSlop={CLOSE_HIT_SLOP}>
            <Ionicons name="close" size={CLOSE_ICON_SIZE} color={colors.iconDefault} />
          </Pressable>
        </View>
        {isLoading ? (
          <JobListSkeleton cardCount={SKELETON_CARDS} />
        ) : isError ? (
          <View style={styles.status}>
            <AppText variant="bodySmall" color="statusDanger">
              {t('sheet.loadError')}
            </AppText>
            <Button title={t('common:actions.retry')} variant="secondary" onPress={onRetry} />
          </View>
        ) : (
          <FlatList
            testID="company-jobs-list"
            data={jobs}
            keyExtractor={(job) => job.id}
            renderItem={({ item }) => <JobListingCard job={item} onShare={onShareJob} onSave={onSaveJob} />}
            contentContainerStyle={styles.list}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<AppText variant="bodySmall">{t('sheet.noJobs')}</AppText>}
            ListFooterComponent={isLoadingMore ? <JobListSkeleton cardCount={1} /> : undefined}
          />
        )}
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.bgScrim,
      opacity: 0.4,
    },
    sheet: {
      maxHeight: '70%',
      paddingTop: spacing[8],
      paddingHorizontal: spacing[16],
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      backgroundColor: colors.bgCanvas,
    },
    handle: {
      alignSelf: 'center',
      width: spacing[32],
      height: spacing[4],
      borderRadius: radius.full,
      backgroundColor: colors.borderStrong,
      marginBottom: spacing[12],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing[12],
      marginBottom: spacing[16],
    },
    titles: {
      flex: 1,
      gap: spacing[2],
    },
    status: {
      gap: spacing[12],
      paddingVertical: spacing[24],
    },
    list: {
      gap: spacing[12],
    },
  });
