import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { profileService } from '../../services/profileService';
import ProfileTitleBadge from '../ProfileTitleBadge';

jest.mock('../../services/profileService', () => ({ profileService: { getProfile: jest.fn() } }));

describe('ProfileTitleBadge', () => {
  it('shows the profile code and plan once loaded', async () => {
    jest.mocked(profileService.getProfile).mockResolvedValue({ code: 'MCSQ9387', plan: 'guest' } as never);

    await renderWithProviders(<ProfileTitleBadge />);

    expect(await screen.findByText('MCSQ9387')).toBeOnTheScreen();
    expect(screen.getByText('Guest')).toBeOnTheScreen();
  });
});
