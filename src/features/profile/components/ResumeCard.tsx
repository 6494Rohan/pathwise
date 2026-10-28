import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import type { Resume } from '../types/profile.types';
import IconButton from './IconButton';
import ResumeNotice, { ResumeNoticeTone } from './ResumeNotice';

const ICON_SIZE = moderateScale(22);

interface ResumeCardNotice {
  tone: ResumeNoticeTone;
  title: string;
  message: string;
}

interface ResumeCardProps {
  resume: Resume | null;
  isImporting: boolean;
  isDownloading: boolean;
  notice: ResumeCardNotice | null;
  onUpload: () => void;
  onDownload: () => void;
  onDismissNotice: () => void;
}

export default function ResumeCard({
  resume,
  isImporting,
  isDownloading,
  notice,
  onUpload,
  onDownload,
  onDismissNotice,
}: ResumeCardProps) {
  const { t } = useTranslation('profile');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.fileIcon}>
          <Ionicons name="document-text-outline" size={ICON_SIZE} color={colors.statusDanger} />
        </View>
        <View style={styles.file}>
          {/* A file name wrapped mid-word is unreadable, so shorten it in the middle and keep the extension. */}
          <AppText variant="labelLarge" numberOfLines={1} ellipsizeMode="middle">
            {isImporting ? t('resume.importing') : resume ? resume.fileName : t('resume.empty')}
          </AppText>
          {isImporting ? (
            <AppText variant="caption">{t('resume.importingHint')}</AppText>
          ) : resume ? (
            <AppText variant="caption">{t(`resume.type.${resume.format}`)}</AppText>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('resume.upload')}
          accessibilityState={{ busy: isImporting, disabled: isImporting }}
          disabled={isImporting}
          onPress={onUpload}
          style={({ pressed }) => [styles.upload, pressed && styles.uploadPressed]}
        >
          {isImporting ? (
            <ActivityIndicator size={ICON_SIZE} color={colors.iconOnBrand} />
          ) : (
            <Ionicons name="arrow-up" size={ICON_SIZE} color={colors.iconOnBrand} />
          )}
        </Pressable>
        {resume ? (
          isDownloading ? (
            <ActivityIndicator size={ICON_SIZE} color={colors.iconBrand} accessibilityLabel={t('resume.download')} />
          ) : (
            <IconButton icon="download-outline" label={t('resume.download')} onPress={onDownload} />
          )
        ) : null}
      </View>
      {notice ? <ResumeNotice {...notice} onDismiss={onDismissNotice} /> : null}
      <AppText variant="caption" color="textTertiary">
        {t('resume.aiNotice')}
      </AppText>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      gap: spacing[12],
      padding: spacing[16],
      borderRadius: radius.lg,
      backgroundColor: colors.bgBrandSubtle,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[12],
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
