import {
  autoSignIn,
  confirmSignIn,
  confirmSignUp,
  getCurrentUser,
  resendSignUpCode,
  signIn,
  signOut,
  signUp,
} from 'aws-amplify/auth';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { env } from '@/config/env';
import { toAuthFailure } from '../acl/authErrorMapper';
import { isCustomChallenge, toConfirmEmailResult, toSessionUser, toSignInResult } from '../acl/authMapper';
import {
  AuthFailure,
  ConfirmEmailResult,
  GoogleAccount,
  SessionUser,
  SignInInput,
  SignInResult,
  SignUpInput,
} from '../types/auth.types';

const hasErrorName = (error: unknown, name: string) => error instanceof Error && error.name === name;

const withAuthFailure = async <T>(action: () => Promise<T>): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    throw toAuthFailure(error);
  }
};

const webClientId = () => {
  const clientId = env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!clientId) throw new Error('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set');
  return clientId;
};

// Google users never type this password; Cognito requires one that meets the password policy.
const randomPassword = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return `${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}Aa1!`;
};

// Sign-up comes first because Cognito hides "user not found" on sign-in; "already exists" means sign in.
const ensureCognitoUser = async (email: string, name: string | null, idToken: string) => {
  try {
    await signUp({
      username: email,
      password: randomPassword(),
      options: {
        userAttributes: name ? { email, name } : { email },
        validationData: { googleIdToken: idToken },
      },
    });
  } catch (error) {
    if (!hasErrorName(error, 'UsernameExistsException')) throw error;
  }
};

const signInWithGoogleToken = async (email: string, idToken: string) => {
  const challenge = await signIn({ username: email, options: { authFlowType: 'CUSTOM_WITHOUT_SRP' } });
  if (!isCustomChallenge(challenge)) throw new AuthFailure('unknown');
  if (toSignInResult(await confirmSignIn({ challengeResponse: idToken })) !== 'signedIn') {
    throw new AuthFailure('unknown');
  }
};

export const authService = {
  getSessionUser: async (): Promise<SessionUser | null> => {
    try {
      return toSessionUser(await getCurrentUser());
    } catch (error) {
      if (hasErrorName(error, 'UserUnAuthenticatedException')) return null;
      throw error;
    }
  },
  pickGoogleAccount: (): Promise<GoogleAccount | null> =>
    withAuthFailure(async () => {
      GoogleSignin.configure({ webClientId: webClientId() });
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) return null;
      const { idToken, user } = response.data;
      if (!idToken) throw new AuthFailure('unknown');
      return { email: user.email, name: user.name, idToken };
    }),
  signInWithGoogleAccount: ({ email, name, idToken }: GoogleAccount): Promise<void> =>
    withAuthFailure(async () => {
      await ensureCognitoUser(email, name, idToken);
      await signInWithGoogleToken(email, idToken);
    }),
  signInWithEmail: ({ email, password }: SignInInput): Promise<SignInResult> =>
    withAuthFailure(async () => toSignInResult(await signIn({ username: email, password }))),
  signUpWithEmail: ({ name, email, password }: SignUpInput): Promise<void> =>
    withAuthFailure(async () => {
      await signUp({ username: email, password, options: { userAttributes: { email, name }, autoSignIn: true } });
    }),
  confirmEmail: (email: string, code: string): Promise<ConfirmEmailResult> =>
    withAuthFailure(async () => {
      const result = toConfirmEmailResult(await confirmSignUp({ username: email, confirmationCode: code }));
      if (result === 'signedIn') await autoSignIn();
      return result;
    }),
  resendEmailCode: (email: string): Promise<void> =>
    withAuthFailure(async () => {
      await resendSignUpCode({ username: email });
    }),
  signOut: async () => {
    await signOut();
    if (GoogleSignin.hasPreviousSignIn()) await GoogleSignin.signOut();
  },
};
