import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/button';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { scale } from '@/utils/scaling';
import type { AdvancedJobFilters } from '../hooks/useJobListFilters';
import type { JobFilterOptions, JobFilterSection, PostedAge } from '../types/jobs.types';
import FilterOptionList, { FilterOption } from './FilterOptionList';
import FilterSection from './FilterSection';

const HANDLE_WIDTH = scale(40);
const EXPERIENCE_YEARS = [0, 1, 2, 3, 5, 8, 10];
const POSTED_AGES: PostedAge[] = ['0-3', '3-7', '7-15', '15-30', '30+'];

interface Section {
  key: JobFilterSection;
  options?: FilterOption[];
  selected: string[];
  onToggle?: (value: string) => void;
  clear?: () => void;
  searchPlaceholder?: string;
  fixedSummary?: string;
}

interface JobFiltersSheetProps {
  visible: boolean;
  focusSection?: JobFilterSection;
  value: AdvancedJobFilters;
  options: JobFilterOptions | undefined;
  isOptionsError: boolean;
  onRetryOptions: () => void;
  matchCount: number | undefined;
  onChange: (value: AdvancedJobFilters) => void;
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;
}

const toggle = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

export default function JobFiltersSheet({
  visible,
  focusSection,
  value,
  options,
  isOptionsError,
  onRetryOptions,
  matchCount,
  onChange,
  onReset,
  onApply,
  onClose,
}: JobFiltersSheetProps) {
  const { t } = useTranslation(['jobs', 'common']);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { bottom } = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<JobFilterSection | null>(null);

  const experienceOptions = EXPERIENCE_YEARS.map((years) => ({
    value: String(years),
    label: years === 0 ? t('filters.fresher') : t('filters.years', { count: years }),
  }));
  const agingOptions = POSTED_AGES.map((age) => ({ value: age, label: t(`filters.age.${age}`) }));

  const sections: Section[] = [
    {
      key: 'location',
      options: options?.cities.map((city) => ({ value: city.name, label: city.name, count: city.jobCount })),
      selected: value.cities,
      onToggle: (city) => onChange({ ...value, cities: toggle(value.cities, city) }),
      clear: () => onChange({ ...value, cities: [] }),
      searchPlaceholder: t('filters.searchLocation'),
    },
    { key: 'country', selected: [], fixedSummary: t('filters.india') },
    {
      key: 'jobTitle',
      options: options?.titles.map((title) => ({ value: title.name, label: title.name, count: title.jobCount })),
      selected: value.titles,
      onToggle: (title) => onChange({ ...value, titles: toggle(value.titles, title) }),
      clear: () => onChange({ ...value, titles: [] }),
      searchPlaceholder: t('filters.searchJobTitle'),
    },
    {
      key: 'company',
      options: options?.companies.map((company) => ({ value: company.id, label: company.name, count: company.jobCount })),
      selected: value.companyIds,
      onToggle: (id) => onChange({ ...value, companyIds: toggle(value.companyIds, id) }),
      clear: () => onChange({ ...value, companyIds: [] }),
      searchPlaceholder: t('filters.searchCompany'),
    },
    {
      key: 'experience',
      options: experienceOptions,
      selected: value.experienceYears === undefined ? [] : [String(value.experienceYears)],
      onToggle: (years) =>
        onChange({ ...value, experienceYears: String(value.experienceYears) === years ? undefined : Number(years) }),
      clear: () => onChange({ ...value, experienceYears: undefined }),
    },
    {
      key: 'aging',
      options: agingOptions,
      selected: value.postedAge ? [value.postedAge] : [],
      onToggle: (age) => onChange({ ...value, postedAge: value.postedAge === age ? undefined : (age as PostedAge) }),
      clear: () => onChange({ ...value, postedAge: undefined }),
    },
    {
      key: 'skills',
      options: options?.skills.map((skill) => ({ value: skill.slug, label: skill.name, count: skill.jobCount })),
      selected: value.skillSlugs,
      onToggle: (slug) => onChange({ ...value, skillSlugs: toggle(value.skillSlugs, slug) }),
      clear: () => onChange({ ...value, skillSlugs: [] }),
      searchPlaceholder: t('filters.searchSkill'),
    },
  ];

  const optionsFallback = isOptionsError ? (
    <View style={styles.status}>
      <AppText variant="bodySmall" color="textSecondary" style={styles.statusText}>
        {t('filters.optionsFailed')}
      </AppText>
      <Pressable accessibilityRole="button" hitSlop={spacing[12]} onPress={onRetryOptions}>
        <AppText variant="labelLarge" color="textBrand">
          {t('common:actions.retry')}
        </AppText>
      </Pressable>
    </View>
  ) : (
    <View style={styles.status}>
      <ActivityIndicator color={colors.iconBrand} />
    </View>
  );

  const optionsOf = (section: Section, scrollable = false) =>
    section.options && section.onToggle ? (
      <FilterOptionList
        options={section.options}
        selected={section.selected}
        onToggle={section.onToggle}
        scrollable={scrollable}
        search={
          section.searchPlaceholder
            ? {
                placeholder: section.searchPlaceholder,
                clearLabel: t('filters.clearSearch'),
                noMatches: t('filters.noMatches'),
              }
            : undefined
        }
      />
    ) : (
      optionsFallback
    );

  const focused = sections.find((section) => section.key === focusSection && section.onToggle);

  const summaryOf = (section: Section) => {
    if (section.fixedSummary) return section.fixedSummary;
    if (section.selected.length === 0) return t('filters.any');
    if (section.selected.length > 1) return t('filters.selectedCount', { count: section.selected.length });
    return section.options?.find((option) => option.value === section.selected[0])?.label ?? section.selected[0];
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      navigationBarTranslucent
      statusBarTranslucent
      onShow={() => setExpanded(null)}
      onRequestClose={onClose}
    >
      {/* A Modal is its own Android window, so the app's keyboard padding (withAndroidImeInsets) doesn't reach it. */}
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        <Pressable
          style={focused ? styles.backdropFocused : styles.backdrop}
          onPress={onClose}
          accessibilityLabel={t('filters.close')}
        />
        <View style={[styles.sheet, focused && styles.sheetFocused, { paddingBottom: bottom + spacing[12] }]}>
          <View style={styles.handle} />
          <View style={[styles.header, !focused && styles.headerDivider]}>
            <AppText variant="heading2" accessibilityRole="header" style={styles.title}>
              {focused ? t(`filters.${focused.key}`) : t('filters.title')}
            </AppText>
            <Pressable accessibilityRole="button" hitSlop={spacing[12]} onPress={focused?.clear ?? onReset}>
              <AppText variant="labelLarge" color="textBrand">
                {t('filters.reset')}
              </AppText>
            </Pressable>
          </View>
          {focused ? (
            <View style={styles.focusedBody}>{optionsOf(focused, true)}</View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scroll}
              contentContainerStyle={styles.sections}
              keyboardShouldPersistTaps="handled"
            >
              {sections.map((section) => (
                <FilterSection
                  key={section.key}
                  title={t(`filters.${section.key}`)}
                  summary={summaryOf(section)}
                  isSet={section.fixedSummary !== undefined || section.selected.length > 0}
                  expanded={expanded === section.key}
                  onToggle={
                    section.onToggle ? () => setExpanded(expanded === section.key ? null : section.key) : undefined
                  }
                >
                  {section.onToggle ? optionsOf(section) : null}
                </FilterSection>
              ))}
            </ScrollView>
          )}
          <Button
            title={
              matchCount === undefined
                ? t('filters.showResults')
                : t('filters.showJobs', { count: matchCount, total: matchCount.toLocaleString() })
            }
            style={styles.apply}
            onPress={onApply}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    backdrop: {
      flex: 1,
      backgroundColor: colors.bgScrim,
      opacity: 0.4,
    },
    backdropFocused: {
      height: '10%',
      backgroundColor: colors.bgScrim,
      opacity: 0.4,
    },
    sheet: {
      maxHeight: '90%',
      paddingTop: spacing[8],
      paddingHorizontal: spacing[16],
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      backgroundColor: colors.bgSheet,
    },
    sheetFocused: {
      flex: 1,
      maxHeight: undefined,
    },
    focusedBody: {
      flex: 1,
    },
    handle: {
      alignSelf: 'center',
      width: HANDLE_WIDTH,
      height: spacing[4],
      borderRadius: radius.full,
      backgroundColor: colors.bgMuted,
      marginBottom: spacing[12],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: spacing[12],
    },
    headerDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderDefault,
    },
    title: {
      flex: 1,
    },
    scroll: {
      flexGrow: 0,
    },
    sections: {
      paddingBottom: spacing[16],
    },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[12],
      paddingVertical: spacing[16],
    },
    statusText: {
      flexShrink: 1,
    },
    apply: {
      marginTop: spacing[12],
    },
  });
