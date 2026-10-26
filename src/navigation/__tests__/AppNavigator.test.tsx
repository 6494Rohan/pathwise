import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import AppNavigator from '../AppNavigator';

describe('AppNavigator', () => {
  it('opens on the Home tab', async () => {
    await renderWithProviders(<AppNavigator />);

    expect(screen.getByText('Environment Variables:')).toBeOnTheScreen();
  });
});
