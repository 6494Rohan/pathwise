import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { signUp } from 'aws-amplify/auth';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import SignUpScreen from '../SignUpScreen';

const navigation = { navigate: jest.fn(), popTo: jest.fn() };

const renderSignUp = () =>
  renderWithProviders(<SignUpScreen navigation={navigation as never} route={{ key: 'SignUp', name: 'SignUp' }} />);

const fillForm = async (password = 'Strong#1pw') => {
  await fireEvent.changeText(screen.getByPlaceholderText('Name'), 'Rohan');
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.co');
  await fireEvent.changeText(screen.getByPlaceholderText('Password'), password);
  await fireEvent.changeText(screen.getByPlaceholderText('Confirm password'), password);
};

describe('SignUpScreen', () => {
  beforeEach(() => navigation.navigate.mockClear());

  it('creates the account and opens email verification', async () => {
    await renderSignUp();
    await fillForm();

    await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));

    expect(signUp).toHaveBeenCalledWith(expect.objectContaining({ username: 'a@b.co', password: 'Strong#1pw' }));
    expect(navigation.navigate).toHaveBeenCalledWith('VerifyEmail', { email: 'a@b.co' });
  });

  it('submits from the keyboard on the last field', async () => {
    jest.mocked(signUp).mockClear();
    await renderSignUp();
    await fillForm();

    await fireEvent(screen.getByPlaceholderText('Confirm password'), 'submitEditing');

    expect(signUp).toHaveBeenCalledTimes(1);
  });

  it('shows field errors without calling Cognito', async () => {
    jest.mocked(signUp).mockClear();
    await renderSignUp();

    await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));

    expect(screen.getByText('Enter a valid email address')).toBeOnTheScreen();
    expect(signUp).not.toHaveBeenCalled();
  });

  it('explains when the email already has an account', async () => {
    jest.mocked(signUp).mockRejectedValueOnce(Object.assign(new Error('x'), { name: 'UsernameExistsException' }));
    await renderSignUp();
    await fillForm();

    await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));

    expect(await screen.findByText('An account with this email already exists. Log in instead.')).toBeOnTheScreen();
  });

  it('goes back to login from the footer link', async () => {
    await renderSignUp();

    await fireEvent.press(screen.getByRole('link', { name: 'Log in' }));

    expect(navigation.popTo).toHaveBeenCalledWith('Login');
  });

  it('locks the form while creating the account', async () => {
    jest.mocked(signUp).mockReturnValueOnce(new Promise(() => undefined));
    await renderSignUp();
    await fillForm();

    await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => expect(screen.getByPlaceholderText('Name')).toHaveProp('editable', false));
    for (const placeholder of ['Name', 'Email', 'Password', 'Confirm password']) {
      expect(screen.getByPlaceholderText(placeholder)).toHaveProp('editable', false);
    }
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'Log in' })).toBeDisabled();
  });
});
