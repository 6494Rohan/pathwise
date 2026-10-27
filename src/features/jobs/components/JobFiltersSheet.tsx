import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/button';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import type { AdvancedJobFilters } from '../hooks/useJobListFilters';
import type { JobFilterOptions } from '../types/jobs.types';

const CLOSE_ICON_SIZE = moderateScale(22);
const EXPERIENCE_YEARS = [0, 1, 2, 3, 5, 8, 10];
const MAX_OPTIONS = 20;

interface JobFiltersSheetProps {
  visible: boolean;
  initial: AdvancedJobFilters;
  options: JobFilterOptions | undefined;
  onApply: (advanced: AdvancedJobFilters) => void;
  onClose: () => void;
}

const toggle = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

export default function JobFiltersSheet({ visible, initial, options, onApply, onClose }: JobFiltersSheetProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { bottom } = useSafeAreaInsets();
  const [draft, setDraft] = useState(initial);

  const chip = (key: string, label: string, selected: boolean, onPress: () => void) => (
    <Pressable
      key={key}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <AppText variant="labelMedium" color={selected ? 'textBrand' : 'textSecondary'}>
        {label}
      </AppText>
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      navigationBarTranslucent
      statusBarTranslucent
      onShow={() => setDraft(initial)}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('filters.close')} />
      <View style={[styles.sheet, { paddingBottom: bottom + spacing[16] }]}>
        <View style={styles.header}>
          <AppText variant="heading2" accessibilityRole="header" style={styles.title}>
            {t('filters.title')}
          </AppText>
          <Pressable accessibilityRole="button" accessibilityLabel={t('filters.close')} hitSlop={spacing[12]} onPress={onClose}>
            <Ionicons name="close" size={CLOSE_ICON_SIZE} color={colors.iconDefault} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.sections}>
          <View style={styles.section}>
            <AppText variant="heading3">{t('filters.experience')}</AppText>
            <View style={styles.chips}>
              {EXPERIENCE_YEARS.map((years) =>
                chip(
                  `experience-${years}`,
                  years === 0 ? t('filters.fresher') : t('filters.years', { count: years }),
                  draft.experienceYears === years,
                  () => setDraft({ ...draft, experienceYears: draft.experienceYears === years ? undefined : years })
                )
              )}
            </View>
          </View>
          <View style={styles.section}>
            <AppText variant="heading3">{t('filters.skills')}</AppText>
            <View style={styles.chips}>
              {options?.skills.slice(0, MAX_OPTIONS).map((skill) =>
                chip(`skill-${skill.slug}`, skill.name, draft.skillSlugs.includes(skill.slug), () =>
                  setDraft({ ...draft, skillSlugs: toggle(draft.skillSlugs, skill.slug) })
                )
              )}
            </View>
          </View>
          <View style={styles.section}>
            <AppText variant="heading3">{t('filters.companies')}</AppText>
            <View style={styles.chips}>
              {options?.companies.slice(0, MAX_OPTIONS).map((company) =>
                chip(`company-${company.id}`, company.name, draft.companyIds.includes(company.id), () =>
                  setDraft({ ...draft, companyIds: toggle(draft.companyIds, company.id) })
                )
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <Button
            title={t('filters.clear')}
            variant="secondary"
            style={styles.action}
            onPress={() => setDraft({ experienceYears: undefined, skillSlugs: [], companyIds: [] })}
          />
          <Button title={t('filters.apply')} style={styles.action} onPress={() => onApply(draft)} />
        </View>
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
      maxHeight: '80%',
      paddingTop: spacing[16],
      paddingHorizontal: spacing[16],
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      backgroundColor: colors.bgCanvas,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[12],
    },
    title: {
      flex: 1,
    },
    sections: {
      gap: spacing[20],
      paddingBottom: spacing[16],
    },
    section: {
      gap: spacing[8],
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[8],
    },
    chip: {
      paddingHorizontal: spacing[12],
      paddingVertical: spacing[6],
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
    chipSelected: {
      borderColor: colors.borderBrand,
      backgroundColor: colors.bgBrandSubtle,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing[12],
      paddingTop: spacing[12],
    },
    action: {
      flex: 1,
    },
  });
