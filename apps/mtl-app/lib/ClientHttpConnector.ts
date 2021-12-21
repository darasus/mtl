import axios, { AxiosInstance } from 'axios';

export class ClientHttpConnector {
  request: AxiosInstance;

  constructor({ accessToken }: { accessToken: string }) {
    this.request = this.createRequest({ accessToken });
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

  createRequest = ({ accessToken }: { accessToken: string }) => {
    const client = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_BASE}`,
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
