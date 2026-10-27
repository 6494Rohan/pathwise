import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { spacing } from '@/theme';
import AppTabBar from '../AppTabBar';

jest.mock('@/hooks/useKeyboardVisible', () => ({ useKeyboardVisible: jest.fn(() => false) }));
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context/jest/mock').default,
  initialWindowMetrics: { frame: { x: 0, y: 0, width: 400, height: 800 }, insets: { top: 0, left: 0, right: 0, bottom: 15 } },
}));

const routes = [
  { key: 'jobs-key', name: 'Jobs', params: undefined },
  { key: 'profile-key', name: 'Profile', params: undefined },
];

const renderBar = (defaultPrevented = false, tabBarHideOnKeyboard = true) => {
  const navigation = { emit: jest.fn(() => ({ defaultPrevented })), navigate: jest.fn() };
  const tabBarIcon = jest.fn(({ focused }: { focused: boolean }) => <Text>{focused ? 'active-icon' : 'icon'}</Text>);
  const props = {
    state: { index: 0, routes },
    descriptors: {
      'jobs-key': { options: { tabBarLabel: 'Jobs', tabBarIcon, tabBarHideOnKeyboard } },
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

  it('hides while the keyboard is open when the screen asks for it', async () => {
    jest.mocked(useKeyboardVisible).mockReturnValueOnce(true);

    await renderBar().render();

    expect(screen.queryByRole('tab', { name: 'Jobs' })).not.toBeOnTheScreen();
  });

  it('stays visible with the keyboard open otherwise', async () => {
    jest.mocked(useKeyboardVisible).mockReturnValueOnce(true);

    await renderBar(false, false).render();

    expect(screen.getByRole('tab', { name: 'Jobs' })).toBeOnTheScreen();
  });

  it('keeps the gesture-bar space while the reported inset is still recovering from the keyboard', async () => {
    await renderBar().render();

    const bar = screen.getByRole('tab', { name: 'Jobs' }).parent!;
    expect(StyleSheet.flatten(bar.props.style).paddingBottom).toBe(15 + spacing[8]);
  });
});
