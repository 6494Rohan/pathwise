import * as user from '..';

describe('user feature public API', () => {
  it('exposes query hooks, keys and form schema', () => {
    expect(Object.keys(user).sort()).toEqual([
      'UpdateProfileSchema',
      'useUpdateProfile',
      'useUserProfile',
      'userKeys',
    ]);
  });

  it('keeps services and the ACL private', () => {
    expect(user).not.toHaveProperty('userService');
    expect(user).not.toHaveProperty('toUserProfile');
  });
});
