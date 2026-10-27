import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, SignUpScreen, useSession, VerifyEmailScreen } from '@/features/auth';
import TabNavigator from './TabNavigator';
import { useNavigationTheme } from '@/theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = { headerShown: false };
const verifyEmailOptions = { headerShown: true, title: '' };

export default function AppNavigator() {
  const navigationTheme = useNavigationTheme();
  const { data: user, isPending } = useSession();

  if (isPending) return null;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={screenOptions}>
        {user ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={verifyEmailOptions} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

