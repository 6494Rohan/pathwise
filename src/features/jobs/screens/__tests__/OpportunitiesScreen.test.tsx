import React from 'react';
import { render, screen } from '@testing-library/react-native';
import OpportunitiesScreen from '../OpportunitiesScreen';

describe('OpportunitiesScreen', () => {
  it('shows the placeholder', async () => {
    await render(<OpportunitiesScreen />);

    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
  });
});
