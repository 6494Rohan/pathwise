import React from 'react';
import { StyleSheet } from 'react-native';
import { ComingSoon, SafeAreaScreen } from '@/components/common';
import { SignOutButton } from '@/features/auth';
import { spacing } from '@/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaScreen edges={[]}>
      <ComingSoon />
      <SignOutButton style={styles.signOut} />
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  signOut: {
    margin: spacing[16],
  },
});
