import * as Location from 'expo-location';
import { toPlaceCoordinate } from '../acl/locationMapper';
import { PlaceSearchError } from '../types/jobs.types';

export const placeService = {
  // Android's geocoder refuses to run until location permission is granted.
  searchPlace: async (query: string) => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) throw new PlaceSearchError('permissionDenied');
    return toPlaceCoordinate(await Location.geocodeAsync(query));
  },
};
