import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import SocialSignInButtons from '../SocialSignInButtons';

describe('SocialSignInButtons', () => {
  it('starts Google sign-in and keeps Apple disabled', async () => {
    const onGooglePress = jest.fn();
    await render(<SocialSignInButtons onGooglePress={onGooglePress} googleLoading={false} disabled={false} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(onGooglePress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Continue with Apple' })).toBeDisabled();
  });

  it('disables Google while another request runs', async () => {
    const onGooglePress = jest.fn();
    await render(<SocialSignInButtons onGooglePress={onGooglePress} googleLoading={false} disabled />);

    await fireEvent.press(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(onGooglePress).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled();
  });
});
