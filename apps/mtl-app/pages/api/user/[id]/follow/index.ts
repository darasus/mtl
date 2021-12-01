import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../../../lib/prismaServices/ActivityService";
import { FollowService } from "../../../../../lib/prismaServices/FollowService";
import { getUserSession } from "../../../../../lib/getUserSession";
import { processErrorResponse } from "../../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(typeof req.query.id === "string", "User ID is not provided");
  invariant(
    req.method === "POST" || req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  const followService = new FollowService();
  const activityService = new ActivityService();

  if (req.method === "GET") {
    try {
      const session = await getUserSession({ req, res });

      if (!session.user?.id) {
        return res.json({ doIFollow: false });
      }

      const response = await followService.doIFollow({
        followingUserId: req.query.id,
        followerUserId: session.user.id,
      });

      return res.json({ doIFollow: response.doIFollow });
    } catch (error) {
      return res.end(processErrorResponse(error));
    }
  }

  if (req.method === "POST") {
    try {
      const session = await getUserSession({ req, res });

      if (!session.user?.id) {
        return res.status(401).end();
      }

      const response = await followService.followUser({
        followingUserId: req.query.id,
        followerUserId: session.user.id,
      });

      await activityService.addFollowActivity({
        ownerId: req.query.id,
        authorId: session.user.id,
        followFollowerId: response.followerId,
        followFollowingId: response.followingId,
      });

      return res.json(response);
    } catch (error) {
      return res.end(processErrorResponse(error));
    }
  }
}
