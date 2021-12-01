import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../../lib/prismaServices/ActivityService";
import { FollowService } from "../../../../lib/prismaServices/FollowService";
import { getUserSession } from "../../../../lib/getUserSession";
import { processErrorResponse } from "../../../../utils/error";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  const activityService = new ActivityService();
  const followService = new FollowService();

  try {
    const session = await getUserSession({ req, res });

    await activityService.removeFollowActivity({
      followFollowingId: req.query.id,
      followFollowerId: session.user.id,
    });

    await followService.unfollowUser({
      followingUserId: req.query.id,
      followerUserId: session.user.id,
    });
    return res.status(200).end();
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
