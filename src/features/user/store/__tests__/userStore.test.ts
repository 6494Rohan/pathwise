import { useUserStore } from '../userStore';

describe('userStore', () => {
  it('signs in and out', () => {
    useUserStore.getState().signIn('1', 't1');
    expect(useUserStore.getState()).toMatchObject({ currentUserId: '1', accessToken: 't1' });

    useUserStore.getState().signOut();
    expect(useUserStore.getState()).toMatchObject({ currentUserId: null, accessToken: null });
  });
});
