import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { PostService } from "../../../../lib/prismaServices/PostService";
import { LikeService } from "../../../../lib/prismaServices/LikeService";
import cache from "../../../../lib/cache";
import { getUserSession } from "../../../../lib/getUserSession";
import { ActivityService } from "../../../../lib/prismaServices/ActivityService";
import { redisCacheKey } from "../../../../lib/RedisCacheKey";
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

  const postId = req.query.id as string;

  try {
    const session = await getUserSession({ req, res });
    const postService = new PostService();
    const likeService = new LikeService();
    const activityService = new ActivityService();
    const post = await postService.fetchPost(postId, session.user.id);

    if (!post) {
      return res.json({ status: "failure" });
    }

    if (!post?.isLikedByMe) {
      return res.status(400).json({ message: "Post is not liked by you yet" });
    }

    await activityService.removeLikeActivity({
      postId,
      authorId: session.user.id,
      ownerId: post?.authorId as string,
    });
    await likeService.unlikePost(postId, session.user.id);
    await cache.del(redisCacheKey.createPostKey(postId));
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
