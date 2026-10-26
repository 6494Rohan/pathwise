import { z } from 'zod';
import { ApiResponseSchema } from '..';

describe('ApiResponseSchema', () => {
  const ItemsSchema = ApiResponseSchema(z.array(z.object({ id: z.string() })));

  it('accepts the standard response envelope', () => {
    expect(ItemsSchema.parse({ data: [{ id: '1' }], success: true })).toEqual({ data: [{ id: '1' }], success: true });
  });

  it('rejects data with the wrong shape', () => {
    expect(ItemsSchema.safeParse({ data: [{ id: 1 }], success: true }).success).toBe(false);
  });
});
