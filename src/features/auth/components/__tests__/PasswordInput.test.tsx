import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import PasswordInput from '../PasswordInput';

describe('PasswordInput', () => {
  it('hides the password until the eye is tapped', async () => {
    await render(<PasswordInput placeholder="Password" value="secret" onChangeText={jest.fn()} />);
    expect(screen.getByPlaceholderText('Password')).toHaveProp('secureTextEntry', true);

    await fireEvent.press(screen.getByRole('button', { name: 'Show password' }));

    expect(screen.getByPlaceholderText('Password')).toHaveProp('secureTextEntry', false);
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeOnTheScreen();
  });

  it('locks the eye toggle when the field is not editable', async () => {
    await render(<PasswordInput placeholder="Password" value="secret" onChangeText={jest.fn()} editable={false} />);

    expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
  });
});
