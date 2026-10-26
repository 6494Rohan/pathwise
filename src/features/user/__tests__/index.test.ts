import * as user from '..';

describe('user feature public API', () => {
  it('exposes hooks, store and form schema', () => {
    expect(Object.keys(user).sort()).toEqual([
      'UpdateProfileSchema',
      'useAuth',
      'useUpdateProfile',
      'useUserProfile',
      'useUserStore',
      'userKeys',
    ]);
  });

  it('keeps services and the ACL private', () => {
    expect(user).not.toHaveProperty('userService');
    expect(user).not.toHaveProperty('toUserProfile');
  });
});
