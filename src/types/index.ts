import { z } from 'zod';

export const ApiResponseSchema = <T extends z.ZodType>(data: T) =>
  z.object({
    data,
    message: z.string().optional(),
    success: z.boolean(),
  });

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

