import Redis from 'ioredis';

const realRedis = new Redis(process.env.REDIS_URL);
const fakeRedis = {
  get: () => null,
  getBuffer: () => null,
  set: () => null,
  del: () => null,
  flushall: () => null,
};

export const redis =
  process.env.DISABLE_REDIS === 'true' ? fakeRedis : realRedis;
