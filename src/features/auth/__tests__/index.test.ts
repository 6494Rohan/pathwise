import * as auth from '..';

describe('auth feature public API', () => {
  it('exposes the screens, sign-out button and session hooks', () => {
    expect(Object.keys(auth).sort()).toEqual([
      'LoginScreen',
      'SignOutButton',
      'SignUpScreen',
      'VerifyEmailScreen',
      'authKeys',
      'clearSession',
      'useSession',
      'useSignOut',
    ]);
  });

  it('keeps services and the ACL private', () => {
    expect(auth).not.toHaveProperty('authService');
    expect(auth).not.toHaveProperty('toSessionUser');
  });
});
