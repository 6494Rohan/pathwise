import * as SecureStore from 'expo-secure-store';
import { secureTokenStorage, toSecureStoreKey } from '../secureTokenStorage';

const mockStore = new Map<string, string>();

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockStore.set(key, value);
  }),
  getItemAsync: jest.fn(async (key: string) => mockStore.get(key) ?? null),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockStore.delete(key);
  }),
}));

const tokenKey = 'CognitoIdentityServiceProvider.client.user-1.accessToken';

describe('secureTokenStorage', () => {
  beforeEach(() => mockStore.clear());

  it('stores, reads and removes values in the secure store', async () => {
    await secureTokenStorage.setItem(tokenKey, 'jwt');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(tokenKey, 'jwt');
    await expect(secureTokenStorage.getItem(tokenKey)).resolves.toBe('jwt');

    await secureTokenStorage.removeItem(tokenKey);
    await expect(secureTokenStorage.getItem(tokenKey)).resolves.toBeNull();
  });

  it('replaces characters the secure store does not allow in keys', async () => {
    expect(toSecureStoreKey('Cognito.client.rohan@example.com.idToken')).toBe('Cognito.client.rohan_example.com.idToken');

    await secureTokenStorage.setItem('a@b', 'value');
    await expect(secureTokenStorage.getItem('a@b')).resolves.toBe('value');
  });

  it('clears every key written, including ones written in parallel', async () => {
    await Promise.all(['accessToken', 'idToken', 'refreshToken'].map((type) => secureTokenStorage.setItem(`k.${type}`, type)));

    await secureTokenStorage.clear();

    expect(mockStore.size).toBe(0);
  });
});
