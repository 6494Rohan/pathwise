import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { clearSession } from '@/features/auth';
import { AppSplash } from '@/features/splash';
import { restoreSavedLanguage } from '@/i18n';
import AppNavigator from '@/navigation/AppNavigator';
import { useRefetchOnAppFocus } from '@/hooks/useRefetchOnAppFocus';
import { configureAmplify, getAccessToken } from '@/services/amplify';
import { configureApi } from '@/services/api';
import { queryClient } from '@/services/queryClient';

// Keeps the native splash up until the animated splash has drawn its first frame (it calls hide()).
SplashScreen.preventAutoHideAsync();

configureAmplify();

configureApi({
  getAuthToken: getAccessToken,
  onUnauthorized: () => clearSession(queryClient),
});

restoreSavedLanguage();

export default function App() {
  useRefetchOnAppFocus();

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
      <StatusBar style="auto" />
      <AppSplash />
    </QueryClientProvider>
  );
}

