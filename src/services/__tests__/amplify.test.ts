import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import outputs from '@/test-utils/amplifyOutputs.json';
import { configureAmplify, getAccessToken } from '../amplify';
import { secureTokenStorage } from '../secureTokenStorage';

describe('amplify', () => {
  it('configures Amplify and keeps tokens in secure storage', () => {
    configureAmplify();

    expect(Amplify.configure).toHaveBeenCalledWith(outputs);
    expect(cognitoUserPoolsTokenProvider.setKeyValueStorage).toHaveBeenCalledWith(secureTokenStorage);
  });

  it('returns the current access token, or null when signed out', async () => {
    jest.mocked(fetchAuthSession).mockResolvedValueOnce({ tokens: { accessToken: { toString: () => 'jwt' } } } as never);
    await expect(getAccessToken()).resolves.toBe('jwt');

    jest.mocked(fetchAuthSession).mockResolvedValueOnce({});
    await expect(getAccessToken()).resolves.toBeNull();
  });
});
