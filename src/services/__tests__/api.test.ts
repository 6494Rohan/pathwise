import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import i18n from '@/i18n';
import { api, configureApi, http } from '../api';

type Reply = { status: number; data?: unknown } | { error: 'timeout' | 'network' };

let requests: InternalAxiosRequestConfig[] = [];

const respondWith = (reply: Reply) => {
  requests = [];
  http.defaults.adapter = async (config) => {
    requests.push(config);
    if ('error' in reply) {
      throw new AxiosError('failed', reply.error === 'timeout' ? 'ECONNABORTED' : 'ERR_NETWORK', config);
    }
    if (reply.status >= 400) {
      const response = { status: reply.status, data: reply.data, statusText: '', headers: {}, config };
      throw new AxiosError('failed', 'ERR_BAD_RESPONSE', config, null, response as never);
    }
    return { status: reply.status, data: reply.data, statusText: 'OK', headers: new AxiosHeaders(), config };
  };
};

describe('api', () => {
  afterEach(() => configureApi({}));

  it('returns the response body and sends auth, language and timeout settings', async () => {
    configureApi({ getAuthToken: () => 'abc' });
    respondWith({ status: 200, data: { id: '1' } });

    await expect(api.get('/me')).resolves.toEqual({ id: '1' });
    expect(requests[0].headers.Authorization).toBe('Bearer abc');
    expect(requests[0].headers['Accept-Language']).toBe(i18n.language);
    expect(requests[0].timeout).toBe(15000);
  });

  it('waits for an async token', async () => {
    configureApi({ getAuthToken: async () => 'fresh' });
    respondWith({ status: 200, data: {} });

    await api.get('/me');

    expect(requests[0].headers.Authorization).toBe('Bearer fresh');
  });

  it('sends the request body for writes', async () => {
    respondWith({ status: 200, data: { ok: true } });

    await api.post('/items', { name: 'A' });

    expect(requests[0].method).toBe('post');
    expect(JSON.parse(requests[0].data)).toEqual({ name: 'A' });
  });

  it('calls onUnauthorized on 401 and keeps the server message', async () => {
    const onUnauthorized = jest.fn();
    configureApi({ onUnauthorized });
    respondWith({ status: 401, data: { message: 'Session expired' } });

    await expect(api.get('/me')).rejects.toMatchObject({ status: 401, message: 'Session expired' });
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('turns failures into readable, translated errors', async () => {
    respondWith({ status: 500 });
    await expect(api.get('/x')).rejects.toMatchObject({ status: 500, message: 'Request failed with status 500' });

    respondWith({ error: 'timeout' });
    await expect(api.get('/x')).rejects.toMatchObject({ message: 'The request timed out. Please try again.' });

    respondWith({ error: 'network' });
    await expect(api.get('/x')).rejects.toMatchObject({ message: 'Network error. Check your connection and try again.' });
  });
});
