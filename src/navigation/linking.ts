import type { LinkingOptions } from '@react-navigation/native';
import { env } from '@/config/env';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['pathwise://', ...(env.EXPO_PUBLIC_WEB_URL ? [env.EXPO_PUBLIC_WEB_URL] : [])],
  config: {
    initialRouteName: 'Main',
    screens: {
      Main: {
        screens: {
          Jobs: 'jobs',
          Skills: 'skills',
          Learning: 'learning',
          Profile: 'profile',
        },
      },
      Login: 'login',
      SignUp: 'signup',
    },
  },
};
