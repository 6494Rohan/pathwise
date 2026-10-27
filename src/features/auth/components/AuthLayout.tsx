import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaScreen } from '@/components/common';
import { spacing } from '@/theme';
import { useKeyboardReveal } from '../hooks/useKeyboardReveal';
import { KeyboardRevealContext } from './KeyboardRevealTarget';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { scrollRef, targetRef, onLayout, onScroll } = useKeyboardReveal();

  return (
    <SafeAreaScreen>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        onLayout={onLayout}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <KeyboardRevealContext.Provider value={targetRef}>{children}</KeyboardRevealContext.Provider>
      </ScrollView>
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[24],
    paddingVertical: spacing[32],
  },
});
