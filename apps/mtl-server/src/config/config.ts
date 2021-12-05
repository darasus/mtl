import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  domain: process.env.AUTH0_DOMAIN,
  clientId: 'e7rAt5eDRujN6jdRkwhcO6hp2HlgxY4k',
  clientSecret:
    'BrftAC9OIQcYhwRokxiNynU-bXcewRmKCTO7eAcVO_5waUM8Qni-XUDAmllV_Z5k',
  audience: 'https://my-tiny-library.eu.auth0.com/api/v2/',
}));
