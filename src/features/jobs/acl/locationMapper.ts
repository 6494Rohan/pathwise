import { Coordinate, PlaceSearchError } from '../types/jobs.types';
import { GeocodedLocationsDtoSchema } from './location.dto';

export const toPlaceCoordinate = (raw: unknown): Coordinate => {
  const [first] = GeocodedLocationsDtoSchema.parse(raw);
  if (!first) throw new PlaceSearchError('notFound');
  return { latitude: first.latitude, longitude: first.longitude };
};
