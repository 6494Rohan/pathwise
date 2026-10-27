import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import Header from '../Header';

describe('Header', () => {
  it('shows the title as a heading', async () => {
    await render(<Header title="Opportunities" />);

    expect(screen.getByRole('header', { name: 'Opportunities' })).toBeOnTheScreen();
  });

  it('shows the actions on the right', async () => {
    await render(<Header title="Opportunities" right={<Text>Share</Text>} />);

    expect(screen.getByText('Share')).toBeOnTheScreen();
  });
});
