import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { lightColors } from '@/theme';
import Button from '../Button';

describe('Button', () => {
  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await render(<Button title="Save" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner and ignores presses while loading', async () => {
    const onPress = jest.fn();
    await render(<Button title="Save" loading onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(screen.queryByText('Save')).toBeNull();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('uses the brand pressed fill while a primary button is held', async () => {
    await render(<Button title="Save" testOnly_pressed />);

    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: lightColors.bgBrandPressed });
  });
});
