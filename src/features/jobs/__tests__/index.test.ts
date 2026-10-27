import * as jobs from '..';

describe('jobs feature public API', () => {
  it('exposes its screen', () => {
    expect(Object.keys(jobs)).toEqual(['OpportunitiesScreen']);
  });
});
