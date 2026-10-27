import React, { createRef } from 'react';
import { StyleSheet, Text, TextInputInstance } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { spacing, typography } from '@/theme';
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

  it('renders the left icon and right accessory', async () => {
    await render(
      <Input value="" onChangeText={jest.fn()} leftIcon={<Text>icon</Text>} rightAccessory={<Text>toggle</Text>} />
    );

    expect(screen.getByText('icon')).toBeOnTheScreen();
    expect(screen.getByText('toggle')).toBeOnTheScreen();
  });

  it('passes its ref to the text field so screens can move focus', async () => {
    const ref = createRef<TextInputInstance>();
    await render(<Input ref={ref} value="" onChangeText={jest.fn()} />);

    expect(ref.current?.focus).toEqual(expect.any(Function));
  });

  it('passes editable to the text field', async () => {
    await render(<Input placeholder="Email" value="" onChangeText={jest.fn()} editable={false} />);

    expect(screen.getByPlaceholderText('Email')).toHaveProp('editable', false);
  });

  it('uses the body font without a line height, which makes Android text inputs jitter', async () => {
    await render(<Input placeholder="Email" value="" onChangeText={jest.fn()} />);

    const field = screen.getByPlaceholderText('Email');
    expect(field).toHaveStyle({ fontFamily: 'Plus Jakarta Sans', textAlignVertical: 'center' });
    expect(StyleSheet.flatten(field.props.style).lineHeight).toBeUndefined();
  });

  it('keeps the design line height as a minimum so password fields do not shrink while typing', async () => {
    await render(<Input placeholder="Password" value="secret" onChangeText={jest.fn()} secureTextEntry />);

    expect(screen.getByPlaceholderText('Password')).toHaveStyle({
      minHeight: typography.body.lineHeight + spacing[12] * 2,
      paddingVertical: spacing[12],
    });
  });
});
