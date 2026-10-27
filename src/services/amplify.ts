import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import outputs from '../../amplify_outputs.json';
import { secureTokenStorage } from './secureTokenStorage';

export const configureAmplify = () => {
  Amplify.configure(outputs);
  cognitoUserPoolsTokenProvider.setKeyValueStorage(secureTokenStorage);
};

export const getAccessToken = async () => {
  const { tokens } = await fetchAuthSession();
  return tokens?.accessToken.toString() ?? null;
};
