import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type TabParamList = {
  Home: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
