import { Platform } from 'react-native';
import * as Location from 'expo-location';
import {
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications';

interface PermissionState {
  status: string;
  canAskAgain: boolean;
}

// Only a first-time question is asked: a user who already answered isn't nagged on every launch.
const askIfNeverAsked = async (check: () => Promise<PermissionState>, request: () => Promise<unknown>) => {
  try {
    const current = await check();
    if (current.status === 'undetermined' && current.canAskAgain) await request();
  } catch {
    // A failed permission check must never block startup; features ask again when they need it.
  }
};

// Android 13+ may not show the notification prompt until the app has a notification channel.
const ensureNotificationChannel = async (channelName: string) => {
  if (Platform.OS !== 'android') return;
  await setNotificationChannelAsync('default', {
    name: channelName,
    importance: AndroidImportance.DEFAULT,
  }).catch(() => null);
};

export const requestStartupPermissions = async (notificationChannelName: string) => {
  await askIfNeverAsked(Location.getForegroundPermissionsAsync, Location.requestForegroundPermissionsAsync);
  await ensureNotificationChannel(notificationChannelName);
  await askIfNeverAsked(getPermissionsAsync, requestPermissionsAsync);
};
