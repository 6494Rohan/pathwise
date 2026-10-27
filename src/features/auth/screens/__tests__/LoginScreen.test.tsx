import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signIn } from 'aws-amplify/auth';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import LoginScreen from '../LoginScreen';

const navigation = { navigate: jest.fn(), popTo: jest.fn() };

const renderLogin = (params?: { verifiedEmail?: string }) =>
  renderWithProviders(<LoginScreen navigation={navigation as never} route={{ key: 'Login', name: 'Login', params }} />);

describe('LoginScreen', () => {
  beforeEach(() => navigation.navigate.mockClear());

  it('starts Google sign-in and keeps Apple disabled', async () => {
    await renderLogin();

    expect(screen.getByText('Welcome')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Continue with Google' }));

    expect(GoogleSignin.signIn).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Continue with Apple' })).toBeDisabled();
  });

  it('asks for the password after a valid email, then logs in', async () => {
    await renderLogin();

    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'a@b.co');
    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
    await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'secret');
    await fireEvent.press(screen.getByRole('button', { name: 'Log in' }));

    expect(signIn).toHaveBeenCalledWith({ username: 'a@b.co', password: 'secret' });
  });

  it('shows an error for wrong credentials', async () => {
    jest.mocked(signIn).mockRejectedValueOnce(Object.assign(new Error('x'), { name: 'NotAuthorizedException' }));
    await renderLogin({ verifiedEmail: 'a@b.co' });

    expect(screen.getByText('Email verified. Log in to continue.')).toBeOnTheScreen();
    await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'wrong');
    await fireEvent.press(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Incorrect email or password.')).toBeOnTheScreen();
  });

  it('sends unverified users to the verification screen', async () => {
    jest.mocked(signIn).mockResolvedValueOnce({ isSignedIn: false, nextStep: { signInStep: 'CONFIRM_SIGN_UP' } });
    await renderLogin({ verifiedEmail: 'a@b.co' });

    await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'secret');
    await fireEvent.press(screen.getByRole('button', { name: 'Log in' }));

    expect(navigation.navigate).toHaveBeenCalledWith('VerifyEmail', { email: 'a@b.co' });
  });

  it('opens sign-up from the footer link', async () => {
    await renderLogin();

    await fireEvent.press(screen.getByRole('link', { name: 'Sign up' }));

    expect(navigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('locks the form while logging in', async () => {
    jest.mocked(signIn).mockReturnValueOnce(new Promise(() => undefined));
    await renderLogin({ verifiedEmail: 'a@b.co' });

    await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'secret');
    await fireEvent.press(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => expect(screen.getByPlaceholderText('Email')).toHaveProp('editable', false));
    expect(screen.getByPlaceholderText('Password')).toHaveProp('editable', false);
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'Sign up' })).toBeDisabled();
  });
});
