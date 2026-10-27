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
