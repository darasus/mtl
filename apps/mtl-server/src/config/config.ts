import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
}));

export const appConfig = registerAs('app', () => ({
  screenshotBaseUrl: process.env.SCREENSHOT_API_BASE_URL,
}));
