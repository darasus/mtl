// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([withNx], {
  nx: {
    // Set this to false if you do not want to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'imagedelivery.net',
      'mytinylibrary.com',
      'lh3.googleusercontent.com',
      's.gravatar.com',
      'secure.gravatar.com',
      'cdn.fakercloud.com',
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: false,
  },
  publicRuntimeConfig: {
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY || '',
    BASE_URL: process.env.BASE_URL || '',
    API_BASE_URL: process.env.API_BASE_URL || '',
  },
});
