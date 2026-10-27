import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import HomeScreen from '../HomeScreen';

describe('HomeScreen', () => {
  it('shows the title, the environment card and sign-out', async () => {
    await renderWithProviders(<HomeScreen />);

    expect(screen.getByText('Home')).toBeOnTheScreen();
    expect(screen.getByText('Environment Variables:')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeOnTheScreen();
  });
});
