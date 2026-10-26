import { act, renderHook } from '@testing-library/react-native';
import { useUserStore } from '../../store/userStore';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('is signed in while a token is stored and signs out', async () => {
    useUserStore.setState({ currentUserId: '1', accessToken: 't1' });
    const { result } = await renderHook(() => useAuth());
    expect(result.current).toMatchObject({ isAuthenticated: true, currentUserId: '1' });

    await act(async () => {
      result.current.signOut();
    });

    expect(result.current).toMatchObject({ isAuthenticated: false, currentUserId: null });
  });
});
