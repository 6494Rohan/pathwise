import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { profileService } from '../../services/profileService';
import { toProfile } from '../../acl/profileMapper';
import { dummyProfileResponse } from '../../services/dummyProfileData';
import ProfileScreen from '../ProfileScreen';

jest.mock('../../services/profileService', () => ({ profileService: { getProfile: jest.fn() } }));
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const signedOut = Object.assign(new Error('signed out'), { name: 'UserUnAuthenticatedException' });

describe('ProfileScreen', () => {
  beforeEach(() => jest.mocked(profileService.getProfile).mockReset().mockResolvedValue(toProfile(dummyProfileResponse)));

  it('shows the profile, resume, experience, education and sign out', async () => {
    await renderWithProviders(<ProfileScreen />);

    expect(await screen.findByRole('header', { name: 'Aarav Menon' })).toBeOnTheScreen();
    expect(screen.getByText('Aarav_Menon_Resume.pdf')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Experience' })).toBeOnTheScreen();
    expect(screen.getByText('Machine Learning Intern')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Education' })).toBeOnTheScreen();
    expect(screen.getByText('University of Massachusetts Amherst')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeOnTheScreen();
  });

  it('says that editing is coming soon', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    await renderWithProviders(<ProfileScreen />);

    await fireEvent.press(await screen.findByRole('button', { name: 'Edit profile' }));

    expect(alert).toHaveBeenCalledWith('Coming soon');
  });

  it('shows an error with retry when the profile fails to load', async () => {
    jest.mocked(profileService.getProfile).mockRejectedValueOnce(new Error('offline'));
    await renderWithProviders(<ProfileScreen />);

    await fireEvent.press(await screen.findByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('header', { name: 'Aarav Menon' })).toBeOnTheScreen();
  });

  it('invites a guest to sign up instead', async () => {
    jest.mocked(getCurrentUser).mockRejectedValueOnce(signedOut);
    await renderWithProviders(<ProfileScreen />);

    expect(await screen.findByRole('header', { name: 'Build your profile' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeOnTheScreen();
  });
});
