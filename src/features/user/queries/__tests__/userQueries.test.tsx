import { act, renderHook, waitFor } from '@testing-library/react-native';
import { createQueryWrapper, createTestQueryClient } from '@/test-utils/renderWithProviders';
import { userService } from '../../services/userService';
import { useUpdateProfile } from '../useUpdateProfile';
import { useUserProfile } from '../useUserProfile';
import { userKeys } from '../userKeys';

jest.mock('../../services/userService', () => ({
  userService: { getProfile: jest.fn(), updateProfile: jest.fn() },
}));

const profile = { id: '1', name: 'Rohan', email: 'r@x.co' };

describe('user queries', () => {
  it('builds profile keys under the users key', () => {
    expect(userKeys.profile('1')).toEqual(['users', 'profile', '1']);
  });

  it('loads a profile', async () => {
    jest.mocked(userService.getProfile).mockResolvedValue(profile);
    const { result } = await renderHook(() => useUserProfile('1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.data).toEqual(profile));
  });

  it('does not fetch without a user id', async () => {
    const { result } = await renderHook(() => useUserProfile(''), { wrapper: createQueryWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
    expect(userService.getProfile).not.toHaveBeenCalledWith('');
  });

  it('writes the updated profile to the cache', async () => {
    jest.mocked(userService.updateProfile).mockResolvedValue(profile);
    const queryClient = createTestQueryClient();
    const { result } = await renderHook(() => useUpdateProfile('1'), { wrapper: createQueryWrapper(queryClient) });

    await act(async () => {
      await result.current.mutateAsync({ name: 'Rohan', email: 'r@x.co' });
    });

    expect(queryClient.getQueryData(userKeys.profile('1'))).toEqual(profile);
  });
});
