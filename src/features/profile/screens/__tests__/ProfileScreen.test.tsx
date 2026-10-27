import React from 'react';
import { screen } from '@testing-library/react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import ProfileScreen from '../ProfileScreen';

const signedOut = Object.assign(new Error('signed out'), { name: 'UserUnAuthenticatedException' });

describe('ProfileScreen', () => {
  it('shows the placeholder and the sign-out button when signed in', async () => {
    await renderWithProviders(<ProfileScreen />);

    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
    expect(await screen.findByRole('button', { name: 'Sign out' })).toBeOnTheScreen();
  });

  it('has no sign-out button for a guest', async () => {
    jest.mocked(getCurrentUser).mockRejectedValueOnce(signedOut);
    await renderWithProviders(<ProfileScreen />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeOnTheScreen();
  });
});
