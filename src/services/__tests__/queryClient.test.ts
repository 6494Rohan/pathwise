import { queryClient } from '../queryClient';

describe('queryClient', () => {
  it('retries queries twice, caches for 30s and never retries mutations', () => {
    expect(queryClient.getDefaultOptions()).toEqual({
      queries: { retry: 2, staleTime: 30 * 1000 },
      mutations: { retry: 0 },
    });
  });
});
