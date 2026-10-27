import * as profile from '..';

describe('profile feature public API', () => {
  it('exposes its screen, header pieces and profile query, not services or the ACL', () => {
    expect(Object.keys(profile).sort()).toEqual(['ProfileScreen', 'ProfileTitleBadge', 'UploadResumeButton', 'useProfile']);
  });
});
