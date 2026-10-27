import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type TabParamList = {
  Jobs: undefined;
  Skills: undefined;
  Learning: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: { verifiedEmail?: string } | undefined;
  SignUp: undefined;
  VerifyEmail: { email: string };
  Main: NavigatorScreenParams<TabParamList>;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
