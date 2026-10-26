import { api } from '@/services/api';
import { userService } from '../userService';

jest.mock('@/services/api', () => ({ api: { get: jest.fn(), put: jest.fn() } }));

const profileDto = { id: '1', full_name: 'Rohan', email_address: 'r@x.co' };
const profile = { id: '1', name: 'Rohan', email: 'r@x.co', avatarUrl: undefined };

describe('userService', () => {
  it('fetches and maps the profile', async () => {
    jest.mocked(api.get).mockResolvedValue(profileDto);

    await expect(userService.getProfile('1')).resolves.toEqual(profile);
    expect(api.get).toHaveBeenCalledWith('/users/1');
  });

  it('sends the backend-shaped body and maps the response', async () => {
    jest.mocked(api.put).mockResolvedValue(profileDto);

    await expect(userService.updateProfile('1', { name: '  Rohan  ', email: 'r@x.co' })).resolves.toEqual(profile);
    expect(api.put).toHaveBeenCalledWith('/users/1', { full_name: 'Rohan', email_address: 'r@x.co', avatar_url: null });
  });
});
