import React, { ComponentType } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  BottomTabBarProps,
  BottomTabHeaderProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/common';
import { OpportunitiesScreen } from '@/features/jobs';
import { LearningScreen } from '@/features/learning';
import { ProfileScreen } from '@/features/profile';
import { SkillsScreen } from '@/features/skills';
import AppTabBar from './components/AppTabBar';
import type { TabParamList } from './types';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  name: keyof TabParamList;
  component: ComponentType;
  namespace: 'jobs' | 'skills' | 'learning' | 'profile';
  icon: { active: IconName; inactive: IconName };
}

const TABS: TabConfig[] = [
  { name: 'Jobs', component: OpportunitiesScreen, namespace: 'jobs', icon: { active: 'briefcase', inactive: 'briefcase-outline' } },
  { name: 'Skills', component: SkillsScreen, namespace: 'skills', icon: { active: 'extension-puzzle', inactive: 'extension-puzzle-outline' } },
  { name: 'Learning', component: LearningScreen, namespace: 'learning', icon: { active: 'book', inactive: 'book-outline' } },
  { name: 'Profile', component: ProfileScreen, namespace: 'profile', icon: { active: 'person', inactive: 'person-outline' } },
];

const Tab = createBottomTabNavigator<TabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <AppTabBar {...props} />;

const renderHeader = ({ options, route }: BottomTabHeaderProps) => (
  <Header title={options.title ?? route.name} right={options.headerRight?.({ canGoBack: false })} />
);

const screenOptions: BottomTabNavigationOptions = { header: renderHeader };

export default function TabNavigator() {
  const { t } = useTranslation(['jobs', 'skills', 'learning', 'profile']);

  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={screenOptions}>
      {TABS.map(({ name, component, namespace, icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            title: t(`${namespace}:title`),
            tabBarLabel: t(`${namespace}:tabTitle`),
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? icon.active : icon.inactive} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
