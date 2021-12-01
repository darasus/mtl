import axios from "axios";
import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import qs from "query-string";
import cache from "../../lib/cache";
import { days } from "../../utils/duration";
import { redisCacheKey } from "../../lib/RedisCacheKey";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.url === "string", "url param is not provided");

  const query = qs.stringify({
    url: req.query.url,
    width: Number(req.query.width) || undefined,
    height: Number(req.query.height) || undefined,
  });

  const cacheKey = redisCacheKey.createScreenshotKey(req.query.url);

  const cachedResponse = await cache.getBuffer(cacheKey);

  if (cachedResponse) {
    return res.status(200).end(cachedResponse);
  }

  const response = await axios.request<ArrayBuffer>({
    url: `${process.env.SCREENSHOT_API_BASE_URL}/api/screenshot?${query}`,
    responseType: "arraybuffer",
  });

  await cache.setBuffer(cacheKey, response.data, days(365));

  return res.status(200).end(Buffer.from(new Uint8Array(response.data)));
}
