import React from 'react';
import { StyleSheet } from 'react-native';
import { ComingSoon, SafeAreaScreen } from '@/components/common';
import { SignOutButton, useSession } from '@/features/auth';
import { spacing } from '@/theme';

export default function ProfileScreen() {
  const { data: user } = useSession();

  return (
    <SafeAreaScreen edges={[]}>
      <ComingSoon />
      {user ? <SignOutButton style={styles.signOut} /> : null}
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  signOut: {
    margin: spacing[16],
  },
});
