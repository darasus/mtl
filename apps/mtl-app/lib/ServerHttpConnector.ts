import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import * as AxiosLogger from "axios-logger";

interface Props {
  req?: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
}

const config = {
  dateFormat: "HH:MM:ss",
  status: true,
  headers: true,
  method: true,
  url: true,
};

export class ServerHttpConnector {
  request: AxiosInstance;

  constructor(props: Props) {
    const cookie = props.req?.headers?.cookie;

    this.request = this.createRequest({
      config: {
        headers: cookie ? { cookie } : {},
      },
    });
  }

  get(url: string) {
    return this.request(url, { method: "GET" });
  }
  post(url: string, body: Record<string, unknown>) {
    return this.request(url, { method: "POST", data: body });
  }
  put(url: string, body: Record<string, unknown>) {
    return this.request(url, { method: "PUT", data: body });
  }
  delete(url: string) {
    return this.request(url, { method: "DELETE" });
  }

  createRequest = (props?: { config?: AxiosRequestConfig }) => {
    const client = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_VERCEL_URL}`,
      ...props?.config,
    });

    client.interceptors.request.use(
      (req) =>
        AxiosLogger.requestLogger(req, {
          ...config,
          logger: console.info.bind(this),
        }),
      (err) =>
        AxiosLogger.errorLogger(err, {
          ...config,
          logger: console.error.bind(this),
        })
    );

    client.interceptors.response.use(
      (req) =>
        AxiosLogger.responseLogger(req, {
          ...config,
          logger: console.info.bind(this),
        }),
      (err) =>
        AxiosLogger.errorLogger(err, {
          ...config,
          logger: console.error.bind(this),
        })
    );

    return client;
  };
}
