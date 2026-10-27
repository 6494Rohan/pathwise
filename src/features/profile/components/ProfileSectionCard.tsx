import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { spacing, ThemeColors, useTheme } from '@/theme';
import type { ProfileEntry } from '../types/profile.types';
import IconButton from './IconButton';
import ProfileCard from './ProfileCard';
import ProfileEntryItem from './ProfileEntryItem';

interface ProfileSectionCardProps {
  title: string;
  entries: ProfileEntry[];
  onAdd: () => void;
  onEdit: () => void;
}

export default function ProfileSectionCard({ title, entries, onAdd, onEdit }: ProfileSectionCardProps) {
  const { t } = useTranslation('profile');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ProfileCard>
      <View style={styles.header}>
        <AppText variant="heading3" accessibilityRole="header" style={styles.title}>
          {title}
        </AppText>
        <IconButton icon="add" label={t('sections.add', { section: title })} onPress={onAdd} />
        <IconButton icon="pencil-outline" label={t('sections.edit', { section: title })} onPress={onEdit} />
      </View>
      <View style={styles.entries}>
        {entries.length ? (
          entries.map((entry) => <ProfileEntryItem key={entry.id} entry={entry} />)
        ) : (
          <AppText variant="bodySmall">{t('sections.empty')}</AppText>
        )}
      </View>
    </ProfileCard>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[16],
      padding: spacing[16],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderDefault,
    },
    title: {
      flex: 1,
    },
    entries: {
      gap: spacing[16],
      padding: spacing[16],
    },
  });
