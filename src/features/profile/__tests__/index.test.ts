import * as profile from '..';

describe('profile feature public API', () => {
  it('exposes its screen', () => {
    expect(Object.keys(profile)).toEqual(['ProfileScreen']);
  });
});
