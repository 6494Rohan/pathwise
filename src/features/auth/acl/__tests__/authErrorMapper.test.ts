import { AuthFailure } from '../../types/auth.types';
import { toAuthFailure } from '../authErrorMapper';

const cognitoError = (name: string) => Object.assign(new Error(name), { name });

describe('toAuthFailure', () => {
  it.each([
    ['NotAuthorizedException', 'wrongCredentials'],
    ['UserNotFoundException', 'wrongCredentials'],
    ['UsernameExistsException', 'emailTaken'],
    ['InvalidPasswordException', 'weakPassword'],
    ['CodeMismatchException', 'invalidCode'],
    ['ExpiredCodeException', 'codeExpired'],
    ['LimitExceededException', 'tooManyAttempts'],
  ])('maps %s to %s', (name, code) => {
    expect(toAuthFailure(cognitoError(name)).code).toBe(code);
  });

  it('falls back to unknown and keeps existing failures', () => {
    expect(toAuthFailure(cognitoError('SomethingNew')).code).toBe('unknown');
    expect(toAuthFailure('boom').code).toBe('unknown');
    const failure = new AuthFailure('emailTaken');
    expect(toAuthFailure(failure)).toBe(failure);
  });
});
