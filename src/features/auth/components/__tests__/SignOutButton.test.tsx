import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { signOut } from 'aws-amplify/auth';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import SignOutButton from '../SignOutButton';

describe('SignOutButton', () => {
  it('signs out through Amplify', async () => {
    await renderWithProviders(<SignOutButton />);

    await fireEvent.press(screen.getByRole('button', { name: 'Sign out' }));

    expect(signOut).toHaveBeenCalled();
  });
});
