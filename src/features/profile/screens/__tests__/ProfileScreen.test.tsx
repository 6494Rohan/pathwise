import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import ProfileScreen from '../ProfileScreen';

describe('ProfileScreen', () => {
  it('shows the placeholder and the sign-out button', async () => {
    await renderWithProviders(<ProfileScreen />);

    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeOnTheScreen();
  });
});
