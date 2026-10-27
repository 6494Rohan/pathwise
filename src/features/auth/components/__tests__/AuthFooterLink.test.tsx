import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import AuthFooterLink from '../AuthFooterLink';

describe('AuthFooterLink', () => {
  it('shows the prompt and calls onPress from the link', async () => {
    const onPress = jest.fn();
    await render(<AuthFooterLink prompt="New to pathwise?" action="Sign up" onPress={onPress} />);

    expect(screen.getByText('New to pathwise?')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('link', { name: 'Sign up' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores taps while disabled', async () => {
    const onPress = jest.fn();
    await render(<AuthFooterLink prompt="New to pathwise?" action="Sign up" onPress={onPress} disabled />);

    await fireEvent.press(screen.getByRole('link', { name: 'Sign up' }));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Sign up' })).toBeDisabled();
  });
});
