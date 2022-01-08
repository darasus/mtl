import axios, { AxiosInstance } from 'axios';
import getConfig from 'next/config';

export class HttpConnector {
  request: AxiosInstance;

  constructor(props?: { accessToken: string | null | undefined }) {
    this.request = this.createRequest({ accessToken: props?.accessToken });
  }

  get(url: string) {
    return this.request(url, { method: 'GET' });
  }
  post(url: string, body: Record<string, unknown>) {
    return this.request(url, { method: 'POST', data: body });
  }
  put(url: string, body: Record<string, unknown>) {
    return this.request(url, { method: 'PUT', data: body });
  }
  delete(url: string) {
    return this.request(url, { method: 'DELETE' });
  }

  createRequest = ({
    accessToken,
  }: {
    accessToken: string | null | undefined;
  }) => {
    const client = axios.create({
      baseURL: `${getConfig().publicRuntimeConfig.API_BASE_URL}`,
      headers: {
        Pragma: 'no-cache',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    client.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error?.response?.status === 401) {
          window.location.href = '/api/auth/login';
        }
        return Promise.reject(error);
      }
    );

    return client;
  };
}
