import React from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button';
import { SafeAreaScreen } from '@/components/common';
import { AppText } from '@/components/typography';
import { SignOutButton, useSession } from '@/features/auth';
import { spacing, useTheme } from '@/theme';
import GuestProfilePrompt from '../components/GuestProfilePrompt';
import LanguageRow from '../components/LanguageRow';
import LanguageSheet from '../components/LanguageSheet';
import ProfileSectionCard from '../components/ProfileSectionCard';
import ProfileSummaryCard from '../components/ProfileSummaryCard';
import ResumeCard from '../components/ResumeCard';
import { useLanguagePicker } from '../hooks/useLanguagePicker';
import { useResumeImport } from '../hooks/useResumeImport';
import { useProfile } from '../queries/useProfile';
import { useResumeDownload } from '../queries/useResumeDownload';

export default function ProfileScreen() {
  const { t } = useTranslation(['profile', 'common']);
  const { colors } = useTheme();
  const { data: user } = useSession();
  const profile = useProfile();
  const resumeImport = useResumeImport();
  const resumeDownload = useResumeDownload();
  const languagePicker = useLanguagePicker();
  const languageRow = (
    <LanguageRow languageName={t(`language.names.${languagePicker.language}`)} onPress={languagePicker.open} />
  );
  const languageSheet = (
    <LanguageSheet
      visible={languagePicker.isOpen}
      languages={languagePicker.languages}
      value={languagePicker.language}
      onChange={languagePicker.choose}
      onClose={languagePicker.close}
    />
  );
  const showComingSoon = () => Alert.alert(t('common:comingSoon'));
  const downloadResume = () => resumeDownload.mutate(undefined, { onSuccess: ({ url }) => Linking.openURL(url) });
  const { result } = resumeImport;
  const resumeNotice = resumeDownload.isError
    ? { tone: 'error' as const, title: t('resume.errors.title'), message: t('resume.errors.download') }
    : result?.kind === 'failed'
      ? { tone: 'error' as const, title: t('resume.errors.title'), message: t(`resume.errors.${result.code}`) }
      : result?.kind === 'imported'
        ? { tone: 'success' as const, title: t('resume.imported.title'), message: t('resume.imported.body') }
        : null;
  const dismissResumeNotice = () => {
    resumeDownload.reset();
    resumeImport.dismiss();
  };

  if (!user) {
    return (
      <SafeAreaScreen edges={[]}>
        <GuestProfilePrompt />
        <View style={styles.guestSettings}>{languageRow}</View>
        {languageSheet}
      </SafeAreaScreen>
    );
  }

  return (
    <SafeAreaScreen edges={[]}>
      {profile.isPending ? (
        <ActivityIndicator color={colors.iconBrand} style={styles.status} />
      ) : profile.isError ? (
        <View style={styles.status}>
          <AppText variant="body" color="statusDanger">
            {t('loadError')}
          </AppText>
          <Button title={t('common:actions.retry')} variant="secondary" onPress={() => profile.refetch()} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <ProfileSummaryCard
            name={profile.data.name}
            email={profile.data.email}
            currentRole={profile.data.currentRole}
            location={profile.data.location}
            preferredLocations={profile.data.preferredLocations}
            onEdit={showComingSoon}
          />
          <ResumeCard
            resume={profile.data.resume}
            isImporting={resumeImport.isImporting}
            isDownloading={resumeDownload.isPending}
            notice={resumeNotice}
            onUpload={resumeImport.start}
            onDownload={downloadResume}
            onDismissNotice={dismissResumeNotice}
          />
          <ProfileSectionCard
            title={t('sections.experience')}
            entries={profile.data.experience}
            onAdd={showComingSoon}
            onEdit={showComingSoon}
          />
          <ProfileSectionCard
            title={t('sections.education')}
            entries={profile.data.education}
            onAdd={showComingSoon}
            onEdit={showComingSoon}
          />
          {languageRow}
          <SignOutButton />
        </ScrollView>
      )}
      {languageSheet}
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[16],
    padding: spacing[16],
  },
  guestSettings: {
    padding: spacing[16],
  },
  status: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[12],
    padding: spacing[24],
  },
});
