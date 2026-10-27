import React from 'react';
import { render, screen } from '@testing-library/react-native';
import GoogleIcon from '../GoogleIcon';

describe('GoogleIcon', () => {
  it('renders the logo', async () => {
    await render(<GoogleIcon size={24} />);

    expect(screen.toJSON()).not.toBeNull();
  });
});
