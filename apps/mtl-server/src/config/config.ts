import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  authManagerAudience: process.env.AUTH0_AUTH_MANAGER_AUDIENCE,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
}));

export const appConfig = registerAs('app', () => ({
  screenshotBaseUrl: process.env.SCREENSHOT_API_BASE_URL,
}));

export const pusherConfig = registerAs('pusher', () => ({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
}));
