import { UpdateProfileSchema } from '../user.types';

describe('UpdateProfileSchema', () => {
  it('trims the name', () => {
    expect(UpdateProfileSchema.parse({ name: '  Rohan  ', email: 'r@x.co' }).name).toBe('Rohan');
  });

  it('uses translation keys as error messages', () => {
    const result = UpdateProfileSchema.safeParse({ name: 'R', email: 'x', avatarUrl: 'not-a-url' });

    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'common:validation.nameTooShort',
      'common:validation.emailInvalid',
      'common:validation.urlInvalid',
    ]);
  });
});
