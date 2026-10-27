import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { spacing, ThemeColors, useTheme } from '@/theme';
import type { JobsSection } from '../types/jobs.types';

const SECTIONS: JobsSection[] = ['recommended', 'allJobs', 'saved', 'applied'];

interface JobsSectionTabsProps {
  selected: JobsSection;
  onSelect: (section: JobsSection) => void;
}

export default function JobsSectionTabs({ selected, onSelect }: JobsSectionTabsProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.bar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {SECTIONS.map((section) => {
          const isSelected = section === selected;
          return (
            <Pressable
              key={section}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(section)}
              style={styles.tab}
            >
              <AppText variant="labelLarge" color={isSelected ? 'textBrand' : 'textSecondary'}>
                {t(`sections.${section}`)}
              </AppText>
              {isSelected ? <View style={styles.underline} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    bar: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderDefault,
      backgroundColor: colors.bgCanvas,
    },
    tabs: {
      paddingHorizontal: spacing[8],
    },
    tab: {
      paddingHorizontal: spacing[12],
      paddingVertical: spacing[12],
    },
    underline: {
      position: 'absolute',
      left: spacing[12],
      right: spacing[12],
      bottom: 0,
      height: 2,
      backgroundColor: colors.bgBrand,
    },
  });
