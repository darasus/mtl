import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { FollowService } from "../../../../../lib/prismaServices/FollowService";
import { processErrorResponse } from "../../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  try {
    const followService = new FollowService();
    const count = await followService.getNumberOfFollowers(req.query.id);
    res.json(count);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
