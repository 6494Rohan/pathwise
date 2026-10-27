import { PlaceSearchError } from '../../types/jobs.types';
import { toPlaceCoordinate } from '../locationMapper';

describe('toPlaceCoordinate', () => {
  it('takes the first geocoded result', () => {
    const raw = [
      { latitude: 12.97, longitude: 77.59, accuracy: 10 },
      { latitude: 1, longitude: 2 },
    ];

    expect(toPlaceCoordinate(raw)).toEqual({ latitude: 12.97, longitude: 77.59 });
  });

  it('reports a place that was not found', () => {
    expect(() => toPlaceCoordinate([])).toThrow(new PlaceSearchError('notFound'));
  });

  it('rejects results without coordinates', () => {
    expect(() => toPlaceCoordinate([{ latitude: 'x' }])).toThrow();
  });
});
