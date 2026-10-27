import { LocationError } from '../../types/jobs.types';
import { toCurrentCoordinate, toPlaceCoordinate } from '../locationMapper';

describe('toPlaceCoordinate', () => {
  it('takes the first geocoded result', () => {
    const raw = [
      { latitude: 12.97, longitude: 77.59, accuracy: 10 },
      { latitude: 1, longitude: 2 },
    ];

    expect(toPlaceCoordinate(raw)).toEqual({ latitude: 12.97, longitude: 77.59 });
  });

  it('reports a place that was not found', () => {
    expect(() => toPlaceCoordinate([])).toThrow(new LocationError('notFound'));
  });

  it('rejects results without coordinates', () => {
    expect(() => toPlaceCoordinate([{ latitude: 'x' }])).toThrow();
  });
});

describe('toCurrentCoordinate', () => {
  it("takes the position's coordinates", () => {
    expect(toCurrentCoordinate({ coords: { latitude: 13.34, longitude: 74.74, accuracy: 20 }, timestamp: 1 })).toEqual({
      latitude: 13.34,
      longitude: 74.74,
    });
  });

  it('rejects a position without coordinates', () => {
    expect(() => toCurrentCoordinate({ coords: {} })).toThrow();
  });
});
