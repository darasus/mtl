const withNx = require('@nrwl/next/plugins/with-nx');
const withPlugins = require('next-compose-plugins');
const { withPlaiceholder } = require('@plaiceholder/next');

module.exports = withPlugins([withNx, withPlaiceholder], {
  productionBrowserSourceMaps: true,
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
    ddRum: {
      applicationId: '2cc395d9-aead-4bfd-95d7-29a54f536d42',
      clientToken: 'pub3033d36d5b288f88e5708e459e43ed52',
      site: 'datadoghq.eu',
      service: 'mtl-app',
      env: process.env.DD_ENV,
      sampleRate: 100,
      trackInteractions: true,
      allowedTracingOrigins: [process.env.API_BASE_URL],
    },
  },
});
