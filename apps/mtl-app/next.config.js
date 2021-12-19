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
  env: {
    NEXT_PUBLIC_VERCEL_URL:
      process.env.VERCEL_ENV === 'production'
        ? 'https://www.mytinylibrary.com'
        : process.env.VERCEL_URL === 'localhost:3000'
        ? `http://${process.env.VERCEL_URL}`
        : `https://${process.env.VERCEL_URL}`,
  },
});
