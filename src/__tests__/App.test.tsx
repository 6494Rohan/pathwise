import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('restores the session and opens the app', async () => {
    await render(<App />);

    expect(await screen.findByRole('header', { name: 'Opportunities' })).toBeOnTheScreen();
  });
});
