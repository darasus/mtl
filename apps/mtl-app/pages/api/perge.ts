import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import cache from "../../lib/cache";
import { processErrorResponse } from "../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  invariant(req.query.token === "123123123", "Invalid token");

  try {
    await cache.perge();
    res.status(200).json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
