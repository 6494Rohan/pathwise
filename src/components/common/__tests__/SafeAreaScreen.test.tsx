import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import SafeAreaScreen from '../SafeAreaScreen';

describe('SafeAreaScreen', () => {
  it('renders its children', async () => {
    await render(
      <SafeAreaScreen testID="screen">
        <Text>Content</Text>
      </SafeAreaScreen>
    );

    expect(screen.getByTestId('screen')).toBeOnTheScreen();
    expect(screen.getByText('Content')).toBeOnTheScreen();
  });
});
