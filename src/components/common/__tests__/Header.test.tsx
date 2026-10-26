import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Header from '../Header';

describe('Header', () => {
  it('shows the title', async () => {
    await render(<Header title="Profile" />);

    expect(screen.getByText('Profile')).toBeOnTheScreen();
  });
});
