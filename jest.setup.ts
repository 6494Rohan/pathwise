import '@/i18n';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default
);
jest.mock('aws-amplify', () => ({ Amplify: { configure: jest.fn() } }));
jest.mock('aws-amplify/auth/cognito', () => ({
  cognitoUserPoolsTokenProvider: { setKeyValueStorage: jest.fn() },
}));
jest.mock('aws-amplify/auth', () => ({
  autoSignIn: jest.fn().mockResolvedValue({ isSignedIn: true, nextStep: { signInStep: 'DONE' } }),
  confirmSignIn: jest.fn().mockResolvedValue({ isSignedIn: true, nextStep: { signInStep: 'DONE' } }),
  confirmSignUp: jest.fn().mockResolvedValue({ nextStep: { signUpStep: 'COMPLETE_AUTO_SIGN_IN' } }),
  fetchAuthSession: jest.fn().mockResolvedValue({}),
  getCurrentUser: jest.fn().mockResolvedValue({ userId: 'user-1', username: 'google_123' }),
  resendSignUpCode: jest.fn().mockResolvedValue({}),
  signIn: jest.fn().mockResolvedValue({ isSignedIn: true, nextStep: { signInStep: 'DONE' } }),
  signOut: jest.fn().mockResolvedValue(undefined),
  signUp: jest.fn().mockResolvedValue({ isSignUpComplete: false, nextStep: { signUpStep: 'CONFIRM_SIGN_UP' } }),
}));
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({
      type: 'success',
      data: { idToken: 'google-id-token', user: { email: 'rohan@example.com', name: 'Rohan' } },
    }),
    hasPreviousSignIn: jest.fn().mockReturnValue(true),
    signOut: jest.fn().mockResolvedValue(null),
  },
  isSuccessResponse: (response: { type: string }) => response.type === 'success',
}));
// The native map can't render in Jest: MapView becomes a View and each Marker a pressable button.
jest.mock('react-native-maps', () => {
  const React: typeof import('react') = require('react');
  const { Pressable, View } = require('react-native');
  const animateToRegion = jest.fn();
  function MapView({ ref, ...props }: { ref?: React.Ref<unknown> }) {
    React.useImperativeHandle(ref, () => ({ animateToRegion }));
    return React.createElement(View, props);
  }
  function Marker({ accessibilityLabel, onPress, children }: { accessibilityLabel?: string; onPress?: () => void; children?: React.ReactNode }) {
    return React.createElement(Pressable, { accessibilityRole: 'button', accessibilityLabel, onPress }, children);
  }
  return { __esModule: true, default: MapView, Marker, mockAnimateToRegion: animateToRegion };
});
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  geocodeAsync: jest.fn().mockResolvedValue([{ latitude: 12.97, longitude: 77.59 }]),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 13.34, longitude: 74.74 } }),
  Accuracy: { Balanced: 3 },
}));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  performAndroidHapticsAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy', Rigid: 'rigid', Soft: 'soft' },
  AndroidHaptics: { Segment_Tick: 'segment-tick' },
}));
