import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import AppNavigator from '../AppNavigator';

const signedOut = Object.assign(new Error('signed out'), { name: 'UserUnAuthenticatedException' });

describe('AppNavigator', () => {
  it('opens on the Jobs tab when signed in', async () => {
    await renderWithProviders(<AppNavigator />);

    expect(await screen.findByRole('header', { name: 'Opportunities' })).toBeOnTheScreen();
  });

  it('shows the login screen when signed out', async () => {
    jest.mocked(getCurrentUser).mockRejectedValueOnce(signedOut);
    await renderWithProviders(<AppNavigator />);

    expect(await screen.findByRole('button', { name: 'Continue with Google' })).toBeOnTheScreen();
  });

  it('returns to the login screen after signing out', async () => {
    await renderWithProviders(<AppNavigator />);
    await fireEvent.press(await screen.findByRole('tab', { name: 'Profile' }));

    jest.mocked(getCurrentUser).mockRejectedValueOnce(signedOut);
    await fireEvent.press(screen.getByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('button', { name: 'Continue with Google' })).toBeOnTheScreen();
  });
});
