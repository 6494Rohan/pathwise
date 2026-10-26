import { toUpdateProfileRequest, toUserProfile } from '../userMapper';

describe('userMapper', () => {
  it('maps the API profile to the frontend model', () => {
    expect(toUserProfile({ id: '1', full_name: 'Rohan H', email_address: 'r@x.co', avatar_url: null })).toEqual({
      id: '1',
      name: 'Rohan H',
      email: 'r@x.co',
      avatarUrl: undefined,
    });
  });

  it('maps form values to the API request body', () => {
    expect(toUpdateProfileRequest({ name: 'Rohan', email: 'r@x.co' })).toEqual({
      full_name: 'Rohan',
      email_address: 'r@x.co',
      avatar_url: null,
    });
  });

  it('rejects a response with the wrong shape', () => {
    expect(() => toUserProfile({ id: 1, name: 'camelCase from the wrong API' })).toThrow();
  });
});
