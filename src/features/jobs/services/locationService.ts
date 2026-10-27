import * as Location from 'expo-location';
import { toCurrentCoordinate, toPlaceCoordinate } from '../acl/locationMapper';
import { LocationError } from '../types/jobs.types';

const requirePermission = async () => {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) throw new LocationError('permissionDenied');
};

export const locationService = {
  // Android's geocoder refuses to run until location permission is granted.
  searchPlace: async (query: string) => {
    await requirePermission();
    return toPlaceCoordinate(await Location.geocodeAsync(query));
  },
  getCurrentLocation: async () => {
    await requirePermission();
    return toCurrentCoordinate(await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
  },
};
