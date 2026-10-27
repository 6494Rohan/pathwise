import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import GuestProfilePrompt from '../GuestProfilePrompt';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('GuestProfilePrompt', () => {
  it('invites a guest to sign up', async () => {
    await render(<GuestProfilePrompt />);

    await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));

    expect(screen.getByRole('header', { name: 'Build your profile' })).toBeOnTheScreen();
    expect(mockNavigate).toHaveBeenCalledWith('SignUp');
  });
});
