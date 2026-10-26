import React from 'react';
import { render, screen } from '@testing-library/react-native';
import EnvironmentCard from '../EnvironmentCard';

describe('EnvironmentCard', () => {
  it('shows the app variant and a fallback for a missing API URL', async () => {
    await render(<EnvironmentCard appVariant="qa" />);

    expect(screen.getByText('EXPO_PUBLIC_APP_VARIANT: qa')).toBeOnTheScreen();
    expect(screen.getByText('EXPO_PUBLIC_API_URL: not set')).toBeOnTheScreen();
  });
});
