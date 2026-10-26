import { z } from 'zod';
import { validateForm } from '../validation';

const Schema = z.object({
  email: z.email('common:validation.emailInvalid'),
  name: z.string().min(2, 'common:validation.nameTooShort'),
});

describe('validateForm', () => {
  it('returns the parsed data when valid', () => {
    expect(validateForm(Schema, { email: 'a@b.co', name: 'Rohan' })).toEqual({
      success: true,
      data: { email: 'a@b.co', name: 'Rohan' },
      errors: {},
    });
  });

  it('returns one translated error per field', () => {
    expect(validateForm(Schema, { email: 'x', name: 'a' }).errors).toEqual({
      email: 'Enter a valid email address',
      name: 'Name must be at least 2 characters',
    });
  });
});
