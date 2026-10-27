import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import AppNavigator from '../AppNavigator';

const signedOut = Object.assign(new Error('signed out'), { name: 'UserUnAuthenticatedException' });

describe('AppNavigator', () => {
  it('opens on the Jobs tab when signed in, with Upload Resume instead of Sign up', async () => {
    await renderWithProviders(<AppNavigator />);

    expect(await screen.findByRole('header', { name: 'Opportunities' })).toBeOnTheScreen();
    expect(await screen.findByRole('button', { name: 'Upload Resume' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Sign up' })).not.toBeOnTheScreen();
  });

  it('lets a guest browse the tabs and open sign up from the header', async () => {
    jest.mocked(getCurrentUser).mockRejectedValueOnce(signedOut);
    await renderWithProviders(<AppNavigator />);

    expect(await screen.findByRole('header', { name: 'Opportunities' })).toBeOnTheScreen();
    await fireEvent.press(await screen.findByRole('button', { name: 'Sign up' }));

    expect(await screen.findByRole('button', { name: 'Continue with Google' })).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Confirm password')).toBeOnTheScreen();
  });

  it('stays on the tabs as a guest after signing out', async () => {
    await renderWithProviders(<AppNavigator />);
    await fireEvent.press(await screen.findByRole('tab', { name: 'Profile' }));

    jest.mocked(getCurrentUser).mockRejectedValueOnce(signedOut);
    await fireEvent.press(screen.getByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('button', { name: 'Sign up' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Profile' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeOnTheScreen();
  });
});
