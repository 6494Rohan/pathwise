import React, { ReactNode, useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';

const PULSE_MS = 800;
const DIMMED_OPACITY = 0.45;

interface SkeletonPulseProps {
  label: string;
  children: ReactNode;
}

// One animation for a whole group of placeholders, so they pulse together; it stays still when Reduce motion is on.
export default function SkeletonPulse({ label, children }: SkeletonPulseProps) {
  const [opacity] = useState(() => new Animated.Value(1));
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: DIMMED_OPACITY, duration: PULSE_MS, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: PULSE_MS, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity, reduceMotion]);

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={{ opacity: reduceMotion ? 1 : opacity }}
    >
      {children}
    </Animated.View>
  );
}
