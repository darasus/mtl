import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { FeedService } from "../../lib/prismaServices/FeedService";
import { getUserSession } from "../../lib/getUserSession";
import { FeedType } from "../../types/FeedType";
import { processErrorResponse } from "../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(
    typeof req.query.feedType === "string",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const feedType = req.query.feedType as FeedType;

  try {
    const session = await getUserSession({ req, res });

    const feedService = new FeedService();

    if (feedType === FeedType.Following) {
      const feed = await feedService.fetchFollowingFeed({
        userId: session.user.id,
        take: Number(req.query.take) || undefined,
        cursor: (req.query.cursor as string) || undefined,
      });

      return res.send(feed);
    }

    if (feedType === FeedType.Latest) {
      const feed = await feedService.fetchLatestFeed({
        userId: session.user.id,
        take: Number(req.query.take) || undefined,
        cursor: (req.query.cursor as string) || undefined,
      });

      return res.send(feed);
    }
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
