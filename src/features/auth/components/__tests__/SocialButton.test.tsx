import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import SocialButton from '../SocialButton';

describe('SocialButton', () => {
  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    await render(<SocialButton title="Continue with Google" icon={null} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores taps while disabled or loading', async () => {
    const onPress = jest.fn();
    await render(<SocialButton title="Continue with Apple" icon={null} onPress={onPress} disabled />);

    await fireEvent.press(screen.getByRole('button', { name: 'Continue with Apple' }));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Continue with Apple' })).toBeDisabled();
  });
});
