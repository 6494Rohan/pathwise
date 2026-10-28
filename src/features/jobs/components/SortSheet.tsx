import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import type { JobSort } from '../types/jobs.types';

const CHECK_ICON_SIZE = moderateScale(20);
const SORTS: JobSort[] = ['newest', 'oldest', 'salary'];

interface SortSheetProps {
  visible: boolean;
  value: JobSort;
  onChange: (sort: JobSort) => void;
  onClose: () => void;
}

export default function SortSheet({ visible, value, onChange, onClose }: SortSheetProps) {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" navigationBarTranslucent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('listHeader.sortClose')} />
      <View style={[styles.sheet, { paddingBottom: bottom + spacing[16] }]}>
        <AppText variant="heading2" accessibilityRole="header" style={styles.title}>
          {t('listHeader.sortTitle')}
        </AppText>
        {SORTS.map((sort) => {
          const selected = sort === value;
          return (
            <Pressable
              key={sort}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(sort)}
              style={styles.option}
            >
              <AppText variant="bodyMedium" color={selected ? 'textBrand' : 'textPrimary'} style={styles.optionLabel}>
                {t(`listHeader.sortOptions.${sort}`)}
              </AppText>
              {selected ? <Ionicons name="checkmark" size={CHECK_ICON_SIZE} color={colors.iconBrand} /> : null}
            </Pressable>
          );
        })}
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
      paddingTop: spacing[16],
      paddingHorizontal: spacing[16],
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      backgroundColor: colors.bgSheet,
    },
    title: {
      marginBottom: spacing[8],
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      paddingVertical: spacing[16],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderDefault,
    },
    optionLabel: {
      flex: 1,
    },
  });
