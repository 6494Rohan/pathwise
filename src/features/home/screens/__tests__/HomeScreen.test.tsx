import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import HomeScreen from '../HomeScreen';

describe('HomeScreen', () => {
  it('shows the title and the environment card', async () => {
    await renderWithProviders(<HomeScreen />);

    expect(screen.getByText('Home')).toBeOnTheScreen();
    expect(screen.getByText('Environment Variables:')).toBeOnTheScreen();
  });
});
