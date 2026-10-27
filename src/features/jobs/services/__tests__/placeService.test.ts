import { geocodeAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { PlaceSearchError } from '../../types/jobs.types';
import { placeService } from '../placeService';

describe('placeService', () => {
  it('asks for location permission, then geocodes the query', async () => {
    await expect(placeService.searchPlace('Bengaluru')).resolves.toEqual({ latitude: 12.97, longitude: 77.59 });

    expect(requestForegroundPermissionsAsync).toHaveBeenCalled();
    expect(geocodeAsync).toHaveBeenCalledWith('Bengaluru');
  });

  it('does not geocode without permission', async () => {
    jest.mocked(geocodeAsync).mockClear();
    jest.mocked(requestForegroundPermissionsAsync).mockResolvedValueOnce({ granted: false } as never);

    await expect(placeService.searchPlace('Bengaluru')).rejects.toEqual(new PlaceSearchError('permissionDenied'));
    expect(geocodeAsync).not.toHaveBeenCalled();
  });

  it('reports a place that was not found', async () => {
    jest.mocked(geocodeAsync).mockResolvedValueOnce([]);

    await expect(placeService.searchPlace('Nowhere')).rejects.toEqual(new PlaceSearchError('notFound'));
  });
});
