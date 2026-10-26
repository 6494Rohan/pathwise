import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import i18n from '@/i18n';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiAuthOptions {
  getAuthToken?: () => string | null | undefined;
  onUnauthorized?: () => void;
}

// Injected from App.tsx so the HTTP layer never imports a feature.
let authOptions: ApiAuthOptions = {};

export const configureApi = (options: ApiAuthOptions) => {
  authOptions = options;
};

export const http = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

http.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language;
  const token = authOptions.getAuthToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const toApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    const { status, data } = error.response;
    const serverMessage = (data as { message?: unknown } | undefined)?.message;
    const message = typeof serverMessage === 'string' ? serverMessage : i18n.t('common:errors.requestFailed', { status });
    return new ApiError(message, status, data);
  }
  if (error.code === 'ECONNABORTED') {
    return new ApiError(i18n.t('common:errors.timeout'));
  }
  return new ApiError(i18n.t('common:errors.network'));
};

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authOptions.onUnauthorized?.();
    }
    return Promise.reject(toApiError(error));
  }
);

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await http.request<T>(config);
  return response.data;
};

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),
  post: <T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data: body }),
  put: <T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data: body }),
  patch: <T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data: body }),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
};
