import { redis } from "./redis";
import { performance } from "perf_hooks";
import "colors";

const fetch = async <T>(key: string, fetcher: () => T, expires: number) => {
  const existing = await get<T>(key);

  if (existing !== null) return existing;

  return set(key, fetcher, expires / 1000);
};

const get = async <T>(key: string): Promise<T | null> => {
  const cacheT0 = performance.now();
  const value = await redis.get(key);
  const cacheT1 = performance.now();
  console.log(
    `[Redis][Get]`.yellow,
    `for ${key} took ${cacheT1 - cacheT0} milliseconds.`
  );
  if (value === null) return null;
  return JSON.parse(value);
};

const getBuffer = async (key: string) => {
  const cacheT0 = performance.now();
  const value = await redis.getBuffer(key);
  const cacheT1 = performance.now();
  console.log(
    `[Redis][Get]`.yellow,
    `for ${key} took ${cacheT1 - cacheT0} milliseconds.`
  );
  if (value === null) return null;
  return value;
};

const set = async <T>(key: string, fetcher: () => T, expires: number) => {
  const t1 = performance.now();
  const value = await fetcher();
  const t2 = performance.now();
  console.log(
    `[Database][Set]`.yellow,
    `for ${key} took ${t2 - t1} milliseconds.`
  );
  const t3 = performance.now();
  await redis.set(key, JSON.stringify(value), "EX", expires / 1000);
  const t4 = performance.now();
  console.log(
    `[Redis][Set]`.yellow,
    `for ${key} took ${t3 - t4} milliseconds.`
  );
  return value;
};

const setBuffer = async (key: string, value: ArrayBuffer, expires: number) => {
  const t1 = performance.now();
  await redis.set(
    key,
    Buffer.from(new Uint8Array(value)),
    "EX",
    expires / 1000
  );
  const t2 = performance.now();
  console.log(
    `[Redis][Set]`.yellow,
    `for ${key} took ${t1 - t2} milliseconds.`
  );
  return value;
};

const del = async (key: string) => {
  const t1 = performance.now();
  await redis.del(key);
  const t2 = performance.now();
  console.log(
    `[Redis][Delete]`.yellow,
    `for ${key} took ${t1 - t2} milliseconds.`
  );
};

const perge = async () => {
  await redis.flushall();
};

const cache = { fetch, set, get, del, perge, getBuffer, setBuffer };

export default cache;
