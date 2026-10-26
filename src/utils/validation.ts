import { z } from 'zod';
import { translateKey } from '@/i18n';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type ValidationResult<T> =
  | { success: true; data: T; errors: FieldErrors<T> }
  | { success: false; data: null; errors: FieldErrors<T> };

export const validateForm = <S extends z.ZodType<Record<string, unknown>>>(
  schema: S,
  values: unknown
): ValidationResult<z.infer<S>> => {
  const result = schema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }

  const { fieldErrors } = z.flattenError(result.error);
  const errors: FieldErrors<z.infer<S>> = {};
  for (const [field, messages] of Object.entries(fieldErrors)) {
    const message = (messages as string[] | undefined)?.[0];
    if (message) errors[field as keyof z.infer<S>] = translateKey(message);
  }
  return { success: false, data: null, errors };
};
