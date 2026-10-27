import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { PillButton } from '..';

describe('PillButton', () => {
  it('shows its title and reports presses', async () => {
    const onPress = jest.fn();
    await render(<PillButton title="Sign up" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));

    expect(onPress).toHaveBeenCalled();
  });
});
