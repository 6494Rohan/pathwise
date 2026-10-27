import { geocodeAsync, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { LocationError } from '../../types/jobs.types';
import { locationService } from '../locationService';

describe('locationService', () => {
  it('asks for location permission, then geocodes the query', async () => {
    await expect(locationService.searchPlace('Bengaluru')).resolves.toEqual({ latitude: 12.97, longitude: 77.59 });

    expect(requestForegroundPermissionsAsync).toHaveBeenCalled();
    expect(geocodeAsync).toHaveBeenCalledWith('Bengaluru');
  });

  it('does not geocode without permission', async () => {
    jest.mocked(geocodeAsync).mockClear();
    jest.mocked(requestForegroundPermissionsAsync).mockResolvedValueOnce({ granted: false } as never);

    await expect(locationService.searchPlace('Bengaluru')).rejects.toEqual(new LocationError('permissionDenied'));
    expect(geocodeAsync).not.toHaveBeenCalled();
  });

  it('reports a place that was not found', async () => {
    jest.mocked(geocodeAsync).mockResolvedValueOnce([]);

    await expect(locationService.searchPlace('Nowhere')).rejects.toEqual(new LocationError('notFound'));
  });

  it("returns the phone's current location", async () => {
    await expect(locationService.getCurrentLocation()).resolves.toEqual({ latitude: 13.34, longitude: 74.74 });
  });

  it('does not read the location without permission', async () => {
    jest.mocked(getCurrentPositionAsync).mockClear();
    jest.mocked(requestForegroundPermissionsAsync).mockResolvedValueOnce({ granted: false } as never);

    await expect(locationService.getCurrentLocation()).rejects.toEqual(new LocationError('permissionDenied'));
    expect(getCurrentPositionAsync).not.toHaveBeenCalled();
  });
});
