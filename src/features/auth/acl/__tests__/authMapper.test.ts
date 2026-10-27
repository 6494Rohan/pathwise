import { AuthFailure } from '../../types/auth.types';
import { toConfirmEmailResult, toSessionUser, toSignInResult } from '../authMapper';

describe('authMapper', () => {
  it('maps the Amplify user to a session user', () => {
    expect(toSessionUser({ userId: 'u1', username: 'google_1', signInDetails: {} })).toEqual({
      id: 'u1',
      username: 'google_1',
    });
  });

  it('rejects an unexpected user shape', () => {
    expect(() => toSessionUser({ id: 'u1' })).toThrow();
  });

  it('maps sign-in steps to sign-in results', () => {
    expect(toSignInResult({ nextStep: { signInStep: 'DONE' } })).toBe('signedIn');
    expect(toSignInResult({ nextStep: { signInStep: 'CONFIRM_SIGN_UP' } })).toBe('emailNotVerified');
    expect(() => toSignInResult({ nextStep: { signInStep: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' } })).toThrow(AuthFailure);
  });

  it('maps the confirm step to whether the user is signed in', () => {
    expect(toConfirmEmailResult({ nextStep: { signUpStep: 'COMPLETE_AUTO_SIGN_IN' } })).toBe('signedIn');
    expect(toConfirmEmailResult({ nextStep: { signUpStep: 'DONE' } })).toBe('signInRequired');
  });
});
