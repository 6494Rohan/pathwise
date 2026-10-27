import React, { ComponentType } from 'react';
import {
  BottomTabBarProps,
  BottomTabHeaderProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import type { SvgProps } from 'react-native-svg';
import JobsIcon from '@/assets/icons/tabs/jobs.svg';
import LearningIcon from '@/assets/icons/tabs/learning.svg';
import ProfileIcon from '@/assets/icons/tabs/profile.svg';
import SkillsIcon from '@/assets/icons/tabs/skills.svg';
import { Header } from '@/components/common';
import { OpportunitiesScreen, ShareAppButton } from '@/features/jobs';
import { LearningScreen } from '@/features/learning';
import { ProfileScreen } from '@/features/profile';
import { SkillsScreen } from '@/features/skills';
import AppTabBar from './components/AppTabBar';
import HeaderPrimaryAction from './components/HeaderPrimaryAction';
import type { TabParamList } from './types';

interface TabConfig {
  name: keyof TabParamList;
  component: ComponentType;
  namespace: 'jobs' | 'skills' | 'learning' | 'profile';
  Icon: ComponentType<SvgProps>;
  HeaderActions?: ComponentType;
}

const TABS: TabConfig[] = [
  { name: 'Jobs', component: OpportunitiesScreen, namespace: 'jobs', Icon: JobsIcon, HeaderActions: ShareAppButton },
  { name: 'Skills', component: SkillsScreen, namespace: 'skills', Icon: SkillsIcon },
  { name: 'Learning', component: LearningScreen, namespace: 'learning', Icon: LearningIcon },
  { name: 'Profile', component: ProfileScreen, namespace: 'profile', Icon: ProfileIcon },
];

const Tab = createBottomTabNavigator<TabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <AppTabBar {...props} />;

const renderHeader = ({ options, route }: BottomTabHeaderProps) => (
  <Header
    title={options.title ?? route.name}
    right={
      <>
        <HeaderPrimaryAction />
        {options.headerRight?.({ canGoBack: false })}
      </>
    }
  />
);

const screenOptions: BottomTabNavigationOptions = { header: renderHeader, tabBarHideOnKeyboard: true };

export default function TabNavigator() {
  const { t } = useTranslation(['jobs', 'skills', 'learning', 'profile']);

  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={screenOptions}>
      {TABS.map(({ name, component, namespace, Icon, HeaderActions }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            title: t(`${namespace}:title`),
            tabBarLabel: t(`${namespace}:tabTitle`),
            tabBarIcon: ({ color, size }) => <Icon color={color} width={size} height={size} />,
            headerRight: HeaderActions ? () => <HeaderActions /> : undefined,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
