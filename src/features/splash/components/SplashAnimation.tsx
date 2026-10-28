import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { AppText } from '@/components/typography';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import logo from '@/assets/icons/icon-prod.png';

// Must equal `imageWidth` of the expo-splash-screen plugin (app.config.ts), in dp, so the native splash hands
// over without a jump; that's why it isn't scaled like other sizes.
const LOGO_SIZE = 120;
const INTRO_MS = 1300;
const EXIT_MS = 380;
const PULSE_MS = 1600;
const TEXT_RISE = spacing[16];

interface SplashAnimationProps {
  appName: string;
  tagline: string;
  status: string | null;
  leaving: boolean;
  onIntroDone: () => void;
  onLeft: () => void;
}

export default function SplashAnimation({ appName, tagline, status, leaving, onIntroDone, onLeft }: SplashAnimationProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const reduceMotion = useReducedMotion();

  const logoScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const textOffset = useSharedValue(reduceMotion ? 0 : TEXT_RISE);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(onIntroDone, reduceMotion ? 0 : INTRO_MS);
    if (reduceMotion) return () => clearTimeout(timer);

    logoScale.set(
      withSequence(
        withTiming(1.12, { duration: 260, easing: Easing.out(Easing.cubic) }),
        withSpring(1, { damping: 9, stiffness: 140 })
      )
    );
    const pulse = (from: number, to: number) =>
      withDelay(
        300,
        withRepeat(withSequence(withTiming(from, { duration: 0 }), withTiming(to, { duration: PULSE_MS, easing: Easing.out(Easing.quad) })), -1)
      );
    pulseScale.set(pulse(1, 2));
    pulseOpacity.set(pulse(0.35, 0));
    textOpacity.set(withDelay(350, withTiming(1, { duration: 450 })));
    textOffset.set(withDelay(350, withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) })));

    return () => clearTimeout(timer);
  }, [reduceMotion, onIntroDone, logoScale, pulseScale, pulseOpacity, textOpacity, textOffset]);

  useEffect(() => {
    if (!leaving) return;
    const finish = (finished?: boolean) => {
      'worklet';
      if (finished) scheduleOnRN(onLeft);
    };
    if (reduceMotion) {
      screenOpacity.set(withTiming(0, { duration: 150 }, finish));
      return;
    }
    logoScale.set(withTiming(1.25, { duration: EXIT_MS, easing: Easing.in(Easing.cubic) }));
    screenOpacity.set(withTiming(0, { duration: EXIT_MS, easing: Easing.in(Easing.quad) }, finish));
  }, [leaving, reduceMotion, onLeft, logoScale, screenOpacity]);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.get() }));
  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: logoScale.get() }] }));
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.get(), transform: [{ scale: pulseScale.get() }] }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.get(), transform: [{ translateY: textOffset.get() }] }));

  return (
    <Animated.View
      style={[styles.screen, screenStyle]}
      onLayout={() => SplashScreen.hide()}
      accessible
      accessibilityLabel={status ?? appName}
      accessibilityRole="progressbar"
    >
      <StatusBar style="light" />
      <View style={styles.center}>
        <Animated.View style={[styles.pulse, pulseStyle]} />
        <Animated.View style={logoStyle}>
          <Image source={logo} style={styles.logo} />
        </Animated.View>
      </View>
      <Animated.View style={[styles.caption, textStyle]}>
        <AppText variant="heading1" color="textOnBrand">
          {appName}
        </AppText>
        <AppText variant="body" color="textOnBrand" style={styles.tagline}>
          {tagline}
        </AppText>
        {status ? (
          <AppText variant="caption" color="textOnBrand" style={styles.status}>
            {status}
          </AppText>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      ...StyleSheet.absoluteFill,
      zIndex: 1,
      backgroundColor: colors.bgSplash,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pulse: {
      position: 'absolute',
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      borderRadius: radius.full,
      backgroundColor: colors.textOnBrand,
    },
    logo: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      borderRadius: radius.xl,
    },
    // Below the logo without moving it off-centre, so it lines up with the native splash.
    caption: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      marginTop: LOGO_SIZE / 2 + spacing[24],
      alignItems: 'center',
      gap: spacing[6],
      paddingHorizontal: spacing[24],
    },
    tagline: {
      opacity: 0.85,
      textAlign: 'center',
    },
    status: {
      opacity: 0.7,
      marginTop: spacing[16],
    },
  });
