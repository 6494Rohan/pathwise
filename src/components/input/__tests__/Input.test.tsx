import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Input from '../Input';

describe('Input', () => {
  it('reports typed text', async () => {
    const onChangeText = jest.fn();
    await render(<Input placeholder="Email" value="" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.co');

    expect(onChangeText).toHaveBeenCalledWith('a@b.co');
  });

  it('shows the error message', async () => {
    await render(<Input value="" onChangeText={jest.fn()} error="Email is required" errorTestID="email-error" />);

    expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
  });
});
