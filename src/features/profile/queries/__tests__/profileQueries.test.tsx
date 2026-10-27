import { renderHook, waitFor } from '@testing-library/react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { createQueryWrapper } from '@/test-utils/renderWithProviders';
import { profileService } from '../../services/profileService';
import { profileKeys } from '../profileKeys';
import { useProfile } from '../useProfile';

jest.mock('../../services/profileService', () => ({ profileService: { getProfile: jest.fn() } }));

const signedOut = Object.assign(new Error('signed out'), { name: 'UserUnAuthenticatedException' });

describe('profile queries', () => {
  beforeEach(() => jest.mocked(profileService.getProfile).mockReset().mockResolvedValue({ name: 'Aarav Menon' } as never));

  it('builds the profile key under the profile key', () => {
    expect(profileKeys.me()).toEqual(['profile', 'me']);
  });

  it('loads the profile once signed in', async () => {
    const { result } = await renderHook(() => useProfile(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.data).toEqual({ name: 'Aarav Menon' }));
  });

  it('does not load a profile for a guest', async () => {
    jest.mocked(getCurrentUser).mockRejectedValueOnce(signedOut);

    const { result } = await renderHook(() => useProfile(), { wrapper: createQueryWrapper() });

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(result.current.fetchStatus).toBe('idle');
    expect(profileService.getProfile).not.toHaveBeenCalled();
  });
});
