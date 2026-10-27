import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button';
import { SafeAreaScreen } from '@/components/common';
import { AppText } from '@/components/typography';
import { SignOutButton, useSession } from '@/features/auth';
import { spacing, useTheme } from '@/theme';
import GuestProfilePrompt from '../components/GuestProfilePrompt';
import ProfileSectionCard from '../components/ProfileSectionCard';
import ProfileSummaryCard from '../components/ProfileSummaryCard';
import ResumeCard from '../components/ResumeCard';
import { useProfile } from '../queries/useProfile';

export default function ProfileScreen() {
  const { t } = useTranslation(['profile', 'common']);
  const { colors } = useTheme();
  const { data: user } = useSession();
  const profile = useProfile();
  const showComingSoon = () => Alert.alert(t('common:comingSoon'));

  if (!user) {
    return (
      <SafeAreaScreen edges={[]}>
        <GuestProfilePrompt />
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
          <ResumeCard resume={profile.data.resume} onUpload={showComingSoon} onDownload={showComingSoon} />
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
          <SignOutButton />
        </ScrollView>
      )}
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[16],
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
