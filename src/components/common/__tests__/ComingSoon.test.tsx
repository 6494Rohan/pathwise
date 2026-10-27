import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ComingSoon from '../ComingSoon';

describe('ComingSoon', () => {
  it('tells the user the screen is not ready yet', async () => {
    await render(<ComingSoon />);

    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
  });
});
