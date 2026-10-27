import * as profile from '..';

describe('profile feature public API', () => {
  it('exposes its screen and the upload resume button', () => {
    expect(Object.keys(profile)).toEqual(['ProfileScreen', 'UploadResumeButton']);
  });
});
