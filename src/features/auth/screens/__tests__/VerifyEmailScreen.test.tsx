import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import VerifyEmailScreen from '../VerifyEmailScreen';

const navigation = { navigate: jest.fn(), popTo: jest.fn() };

const renderVerify = () =>
  renderWithProviders(
    <VerifyEmailScreen
      navigation={navigation as never}
      route={{ key: 'VerifyEmail', name: 'VerifyEmail', params: { email: 'a@b.co' } }}
    />
  );

describe('VerifyEmailScreen', () => {
  beforeEach(() => navigation.popTo.mockClear());

  it('confirms the code for the email', async () => {
    await renderVerify();

    expect(screen.getByText('Enter the 6-digit code we sent to a@b.co.')).toBeOnTheScreen();
    await fireEvent.changeText(screen.getByPlaceholderText('6-digit code'), '123456');
    await fireEvent.press(screen.getByRole('button', { name: 'Verify' }));

    expect(confirmSignUp).toHaveBeenCalledWith({ username: 'a@b.co', confirmationCode: '123456' });
  });

  it('rejects a code that is not 6 digits', async () => {
    jest.mocked(confirmSignUp).mockClear();
    await renderVerify();

    await fireEvent.changeText(screen.getByPlaceholderText('6-digit code'), '12');
    await fireEvent.press(screen.getByRole('button', { name: 'Verify' }));

    expect(screen.getByText('Enter the 6-digit code')).toBeOnTheScreen();
    expect(confirmSignUp).not.toHaveBeenCalled();
  });

  it('returns to login when automatic sign-in is not available', async () => {
    jest.mocked(confirmSignUp).mockResolvedValueOnce({ isSignUpComplete: true, nextStep: { signUpStep: 'DONE' } });
    await renderVerify();

    await fireEvent.changeText(screen.getByPlaceholderText('6-digit code'), '123456');
    await fireEvent.press(screen.getByRole('button', { name: 'Verify' }));

    expect(navigation.popTo).toHaveBeenCalledWith('Login', { verifiedEmail: 'a@b.co' });
  });

  it('resends the code', async () => {
    await renderVerify();

    await fireEvent.press(screen.getByRole('link', { name: 'Resend' }));

    expect(resendSignUpCode).toHaveBeenCalledWith({ username: 'a@b.co' });
    expect(await screen.findByText('We sent you a new code.')).toBeOnTheScreen();
  });

  it('locks the code field and links while verifying', async () => {
    jest.mocked(confirmSignUp).mockReturnValueOnce(new Promise(() => undefined));
    await renderVerify();

    await fireEvent.changeText(screen.getByPlaceholderText('6-digit code'), '123456');
    await fireEvent.press(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => expect(screen.getByPlaceholderText('6-digit code')).toHaveProp('editable', false));
    expect(screen.getByRole('link', { name: 'Resend' })).toBeDisabled();
  });
});
