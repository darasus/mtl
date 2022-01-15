import { Client } from 'redis-om';

const REDIS_URL =
  'redis://default:gEo5lwzkoPO4NBvp1HFGSyRunh9ZdDii@redis-17065.c293.eu-central-1-1.ec2.cloud.redislabs.com:17065';

export const redisClient = new Client();

export async function redisConnect() {
  if (!redisClient.isOpen()) {
    await redisClient.open(REDIS_URL);
  }
}
