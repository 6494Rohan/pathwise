import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import type { Resume } from '../types/profile.types';
import IconButton from './IconButton';

const ICON_SIZE = moderateScale(22);

interface ResumeCardProps {
  resume: Resume | null;
  onUpload: () => void;
  onDownload: () => void;
}

export default function ResumeCard({ resume, onUpload, onDownload }: ResumeCardProps) {
  const { t } = useTranslation('profile');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.fileIcon}>
        <Ionicons name="document-text-outline" size={ICON_SIZE} color={colors.statusDanger} />
      </View>
      <View style={styles.file}>
        {/* A file name wrapped mid-word is unreadable, so shorten it in the middle and keep the extension. */}
        <AppText variant="labelLarge" numberOfLines={1} ellipsizeMode="middle">
          {resume ? resume.fileName : t('resume.empty')}
        </AppText>
        {resume ? <AppText variant="caption">{t(`resume.type.${resume.format}`)}</AppText> : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('resume.upload')}
        onPress={onUpload}
        style={({ pressed }) => [styles.upload, pressed && styles.uploadPressed]}
      >
        <Ionicons name="arrow-up" size={ICON_SIZE} color={colors.iconOnBrand} />
      </Pressable>
      {resume ? <IconButton icon="download-outline" label={t('resume.download')} onPress={onDownload} /> : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
      padding: spacing[16],
      borderRadius: radius.lg,
      backgroundColor: colors.bgBrandSubtle,
    },
    fileIcon: {
      padding: spacing[8],
      borderRadius: radius.md,
      backgroundColor: colors.statusDangerBg,
    },
    file: {
      flex: 1,
      gap: spacing[2],
    },
    upload: {
      padding: spacing[8],
      borderRadius: radius.full,
      backgroundColor: colors.bgBrand,
    },
    uploadPressed: {
      backgroundColor: colors.bgBrandPressed,
    },
  });
