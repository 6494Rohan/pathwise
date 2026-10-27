import React from 'react';
import { render, screen } from '@testing-library/react-native';
import OrDivider from '../OrDivider';

describe('OrDivider', () => {
  it('shows the Or label', async () => {
    await render(<OrDivider />);

    expect(screen.getByText('Or')).toBeOnTheScreen();
  });
});
