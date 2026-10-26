import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/features/user';
import { restoreSavedLanguage } from '@/i18n';
import AppNavigator from '@/navigation/AppNavigator';
import { useRefetchOnAppFocus } from '@/hooks/useRefetchOnAppFocus';
import { configureApi } from '@/services/api';
import { queryClient } from '@/services/queryClient';

configureApi({
  getAuthToken: () => useUserStore.getState().accessToken,
  onUnauthorized: () => {
    useUserStore.getState().signOut();
    queryClient.clear();
  },
});

restoreSavedLanguage();

export default function App() {
  useRefetchOnAppFocus();

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}

