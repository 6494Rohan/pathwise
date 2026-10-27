import { z } from 'zod';

export const GeocodedLocationsDtoSchema = z.array(z.object({ latitude: z.number(), longitude: z.number() }));

export const CurrentPositionDtoSchema = z.object({ coords: z.object({ latitude: z.number(), longitude: z.number() }) });
