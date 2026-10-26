import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { HomeScreen } from '@/features/home';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const screenOptions = { headerShown: false };

export default function TabNavigator() {
  const { t } = useTranslation('home');
  const homeOptions = { title: t('tabTitle') };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} options={homeOptions} />
    </Tab.Navigator>
  );
}

