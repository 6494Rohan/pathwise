import React from 'react';
import { Text } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { fireEvent, render, screen } from '@testing-library/react-native';
import AppTabBar from '../AppTabBar';

const routes = [
  { key: 'jobs-key', name: 'Jobs', params: undefined },
  { key: 'profile-key', name: 'Profile', params: undefined },
];

const renderBar = (defaultPrevented = false) => {
  const navigation = { emit: jest.fn(() => ({ defaultPrevented })), navigate: jest.fn() };
  const tabBarIcon = jest.fn(({ focused }: { focused: boolean }) => <Text>{focused ? 'active-icon' : 'icon'}</Text>);
  const props = {
    state: { index: 0, routes },
    descriptors: {
      'jobs-key': { options: { tabBarLabel: 'Jobs', tabBarIcon } },
      'profile-key': { options: { title: 'Profile', tabBarIcon } },
    },
    navigation,
    insets: { top: 0, bottom: 0, left: 0, right: 0 },
  } as unknown as BottomTabBarProps;
  return { navigation, tabBarIcon, render: () => render(<AppTabBar {...props} />) };
};

describe('AppTabBar', () => {
  it('shows each tab with its label and marks the active one', async () => {
    const bar = renderBar();
    await bar.render();

    expect(screen.getByRole('tab', { name: 'Jobs' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Profile' })).not.toBeSelected();
    expect(screen.getByText('active-icon')).toBeOnTheScreen();
  });

  it('navigates to a tab when it is pressed', async () => {
    const bar = renderBar();
    await bar.render();

    await fireEvent.press(screen.getByRole('tab', { name: 'Profile' }));

    expect(bar.navigation.emit).toHaveBeenCalledWith({ type: 'tabPress', target: 'profile-key', canPreventDefault: true });
    expect(bar.navigation.navigate).toHaveBeenCalledWith('Profile', undefined);
  });

  it('does not navigate when the press is prevented or the tab is already active', async () => {
    const bar = renderBar(true);
    await bar.render();

    await fireEvent.press(screen.getByRole('tab', { name: 'Profile' }));
    await fireEvent.press(screen.getByRole('tab', { name: 'Jobs' }));

    expect(bar.navigation.navigate).not.toHaveBeenCalled();
  });
});
