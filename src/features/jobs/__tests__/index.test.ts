import * as jobs from '..';

describe('jobs feature public API', () => {
  it('exposes its screen, share button and query hooks, not services or the ACL', () => {
    expect(Object.keys(jobs).sort()).toEqual(['OpportunitiesScreen', 'ShareAppButton', 'useCompanyJobs', 'useMapCompanies']);
  });
});
