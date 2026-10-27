import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import TabNavigator from '../TabNavigator';

const renderTabs = () =>
  renderWithProviders(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );

describe('TabNavigator', () => {
  it('shows the four tabs and opens on Jobs with its header', async () => {
    await renderTabs();

    for (const label of ['Jobs', 'Skills', 'Learning', 'Profile']) {
      expect(screen.getByRole('tab', { name: label })).toBeOnTheScreen();
    }
    expect(screen.getByRole('tab', { name: 'Jobs' })).toBeSelected();
    expect(screen.getByRole('header', { name: 'Opportunities' })).toBeOnTheScreen();
  });

  it('switches tab and header when another tab is pressed', async () => {
    await renderTabs();

    await fireEvent.press(screen.getByRole('tab', { name: 'Profile' }));

    expect(screen.getByRole('tab', { name: 'Profile' })).toBeSelected();
    expect(screen.getByRole('header', { name: 'Profile' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeOnTheScreen();
  });
});
