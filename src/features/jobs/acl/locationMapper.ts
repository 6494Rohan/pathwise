import { Coordinate, LocationError } from '../types/jobs.types';
import { CurrentPositionDtoSchema, GeocodedLocationsDtoSchema } from './location.dto';

export const toPlaceCoordinate = (raw: unknown): Coordinate => {
  const [first] = GeocodedLocationsDtoSchema.parse(raw);
  if (!first) throw new LocationError('notFound');
  return { latitude: first.latitude, longitude: first.longitude };
};

export const toCurrentCoordinate = (raw: unknown): Coordinate => {
  const { latitude, longitude } = CurrentPositionDtoSchema.parse(raw).coords;
  return { latitude, longitude };
};
