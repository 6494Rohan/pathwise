import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import TabNavigator from '../TabNavigator';

describe('TabNavigator', () => {
  it('shows the translated Home tab', async () => {
    await renderWithProviders(
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    );

    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
  });
});
