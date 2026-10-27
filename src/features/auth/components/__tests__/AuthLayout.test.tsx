import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import AuthLayout from '../AuthLayout';

describe('AuthLayout', () => {
  it('renders its content', async () => {
    await render(
      <AuthLayout>
        <Text>Form</Text>
      </AuthLayout>
    );

    expect(screen.getByText('Form')).toBeOnTheScreen();
  });
});
