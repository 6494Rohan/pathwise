import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import SignUpHeaderButton from '../SignUpHeaderButton';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('SignUpHeaderButton', () => {
  it('opens the sign up screen', async () => {
    await render(<SignUpHeaderButton />);

    await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));

    expect(mockNavigate).toHaveBeenCalledWith('SignUp');
  });
});
