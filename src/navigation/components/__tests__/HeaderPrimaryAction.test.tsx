import React from 'react';
import { screen } from '@testing-library/react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import HeaderPrimaryAction from '../HeaderPrimaryAction';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const signedOut = Object.assign(new Error('signed out'), { name: 'UserUnAuthenticatedException' });

describe('HeaderPrimaryAction', () => {
  it('offers resume upload when signed in', async () => {
    await renderWithProviders(<HeaderPrimaryAction />);

    expect(await screen.findByRole('button', { name: 'Upload Resume' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Sign up' })).not.toBeOnTheScreen();
  });

  it('offers sign up to a guest', async () => {
    jest.mocked(getCurrentUser).mockRejectedValueOnce(signedOut);
    await renderWithProviders(<HeaderPrimaryAction />);

    expect(await screen.findByRole('button', { name: 'Sign up' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Upload Resume' })).not.toBeOnTheScreen();
  });
});
