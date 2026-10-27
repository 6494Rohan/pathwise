import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AuthFailure } from '../../types/auth.types';
import AuthErrorText from '../AuthErrorText';

describe('AuthErrorText', () => {
  it('shows the message for an auth failure', async () => {
    await render(<AuthErrorText error={new AuthFailure('wrongCredentials')} />);

    expect(screen.getByText('Incorrect email or password.')).toBeOnTheScreen();
  });

  it('shows a generic message for other errors and nothing without an error', async () => {
    await render(<AuthErrorText error={new Error('boom')} />);
    expect(screen.getByText('Something went wrong. Please try again.')).toBeOnTheScreen();

    await render(<AuthErrorText error={null} />);
    expect(screen.toJSON()).toBeNull();
  });
});
