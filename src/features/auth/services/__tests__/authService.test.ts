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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authService } from '../authService';

const namedError = (name: string, message = name) => Object.assign(new Error(message), { name });

describe('authService', () => {
  it('returns the signed-in user', async () => {
    await expect(authService.getSessionUser()).resolves.toEqual({ id: 'user-1', username: 'google_123' });
  });

  it('returns null when nobody is signed in', async () => {
    jest.mocked(getCurrentUser).mockRejectedValueOnce(namedError('UserUnAuthenticatedException'));

    await expect(authService.getSessionUser()).resolves.toBeNull();
  });

  it('rethrows other session errors', async () => {
    jest.mocked(getCurrentUser).mockRejectedValueOnce(namedError('NetworkError'));

    await expect(authService.getSessionUser()).rejects.toThrow('NetworkError');
  });

  describe('Google', () => {
    const account = { email: 'rohan@example.com', name: 'Rohan', idToken: 'google-id-token' };
    const customChallenge = { isSignedIn: false, nextStep: { signInStep: 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE' } };

    beforeEach(() => {
      jest.mocked(signUp).mockClear();
    });

    it('returns the account picked in the native picker', async () => {
      await expect(authService.pickGoogleAccount()).resolves.toEqual(account);
      expect(GoogleSignin.configure).toHaveBeenCalledWith({ webClientId: 'test-web-client.apps.googleusercontent.com' });
    });

    it('returns null when the picker is dismissed', async () => {
      jest.mocked(GoogleSignin.signIn).mockResolvedValueOnce({ type: 'cancelled', data: null });

      await expect(authService.pickGoogleAccount()).resolves.toBeNull();
    });

    it('creates the Cognito user and signs in with the Google token', async () => {
      jest.mocked(signIn).mockResolvedValueOnce(customChallenge as never);

      await authService.signInWithGoogleAccount(account);

      expect(signUp).toHaveBeenCalledWith({
        username: 'rohan@example.com',
        password: expect.stringMatching(/^[0-9a-f]{48}Aa1!$/),
        options: {
          userAttributes: { email: 'rohan@example.com', name: 'Rohan' },
          validationData: { googleIdToken: 'google-id-token' },
        },
      });
      expect(signIn).toHaveBeenCalledWith({ username: 'rohan@example.com', options: { authFlowType: 'CUSTOM_WITHOUT_SRP' } });
      expect(confirmSignIn).toHaveBeenCalledWith({ challengeResponse: 'google-id-token' });
    });

    it('signs in to the existing account when the email is already registered', async () => {
      jest.mocked(signUp).mockRejectedValueOnce(namedError('UsernameExistsException'));
      jest.mocked(signIn).mockResolvedValueOnce(customChallenge as never);

      await expect(authService.signInWithGoogleAccount(account)).resolves.toBeUndefined();
      expect(confirmSignIn).toHaveBeenCalledWith({ challengeResponse: 'google-id-token' });
    });

    it('fails when Cognito does not ask for the Google token', async () => {
      await expect(authService.signInWithGoogleAccount(account)).rejects.toMatchObject({ code: 'unknown' });
    });
  });

  it('signs out of Amplify and the Google account', async () => {
    await authService.signOut();

    expect(signOut).toHaveBeenCalled();
    expect(GoogleSignin.signOut).toHaveBeenCalled();
  });

  it('signs in with email and password', async () => {
    await expect(authService.signInWithEmail({ email: 'a@b.co', password: 'pw' })).resolves.toBe('signedIn');
    expect(signIn).toHaveBeenCalledWith({ username: 'a@b.co', password: 'pw' });
  });

  it('turns Cognito errors into auth failures', async () => {
    jest.mocked(signIn).mockRejectedValueOnce(namedError('NotAuthorizedException'));

    await expect(authService.signInWithEmail({ email: 'a@b.co', password: 'pw' })).rejects.toMatchObject({
      code: 'wrongCredentials',
    });
  });

  it('signs up with name and email and asks Amplify to sign in after verification', async () => {
    await authService.signUpWithEmail({ name: 'Rohan', email: 'a@b.co', password: 'Pw1!aaaa', confirmPassword: 'Pw1!aaaa' });

    expect(signUp).toHaveBeenCalledWith({
      username: 'a@b.co',
      password: 'Pw1!aaaa',
      options: { userAttributes: { email: 'a@b.co', name: 'Rohan' }, autoSignIn: true },
    });
  });

  it('confirms the email and completes the automatic sign-in', async () => {
    await expect(authService.confirmEmail('a@b.co', '123456')).resolves.toBe('signedIn');
    expect(confirmSignUp).toHaveBeenCalledWith({ username: 'a@b.co', confirmationCode: '123456' });
    expect(autoSignIn).toHaveBeenCalled();
  });

  it('asks for a manual sign-in when automatic sign-in is not available', async () => {
    jest.mocked(autoSignIn).mockClear();
    jest.mocked(confirmSignUp).mockResolvedValueOnce({ isSignUpComplete: true, nextStep: { signUpStep: 'DONE' } });

    await expect(authService.confirmEmail('a@b.co', '123456')).resolves.toBe('signInRequired');
    expect(autoSignIn).not.toHaveBeenCalled();
  });

  it('resends the verification code', async () => {
    await authService.resendEmailCode('a@b.co');

    expect(resendSignUpCode).toHaveBeenCalledWith({ username: 'a@b.co' });
  });
});
