import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../../lib/prismaServices/ActivityService";
import { processErrorResponse } from "../../../../utils/error";

export default withApiAuthRequired(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "Activity ID is not provided");

  const activityService = new ActivityService();

  try {
    const activity = await activityService.markActivityAsRead({
      activityId: req.query.id,
    });
    return res.json(activity);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
