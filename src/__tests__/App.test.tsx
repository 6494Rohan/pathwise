import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders the app with all providers', async () => {
    await render(<App />);

    expect(screen.toJSON()).not.toBeNull();
  });
});
