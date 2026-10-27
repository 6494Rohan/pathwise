import { profileService } from '../profileService';

describe('profileService', () => {
  it('returns the dummy profile after a short delay', async () => {
    jest.useFakeTimers();
    const request = profileService.getProfile();
    await jest.runAllTimersAsync();

    await expect(request).resolves.toEqual(expect.objectContaining({ name: 'Aarav Menon' }));
    jest.useRealTimers();
  });
});
