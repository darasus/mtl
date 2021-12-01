import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../lib/prismaServices/ActivityService";
import { getUserSession } from "../../../lib/getUserSession";
import { processErrorResponse } from "../../../utils/error";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  const activityService = new ActivityService();

  try {
    const session = await getUserSession({ req, res });

    const activity = await activityService.markAllActivityAsRead({
      userId: session.user.id,
    });
    return res.json(activity);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
