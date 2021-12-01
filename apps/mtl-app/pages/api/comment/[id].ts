import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../lib/prismaServices/ActivityService";
import { CommentService } from "../../../lib/prismaServices/CommentService";
import { PostService } from "../../../lib/prismaServices/PostService";
import { getUserSession } from "../../../lib/getUserSession";
import { processErrorResponse } from "../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "DELETE",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "ID is missing");

  const commentId = req.query.id;
  const commentService = new CommentService();
  const postService = new PostService();
  const activityService = new ActivityService();

  try {
    const session = await getUserSession({ req, res });

    if (!session) {
      return res.status(401).end();
    }

    const isMyComment = await commentService.isMyComment({
      commentId,
      userId: session.user.id,
    });

    if (!isMyComment) {
      return res.status(403).send({
        status: 403,
        hasError: true,
        message: "You can only delete your own comments",
      });
    }

    const post = await postService.findPostByCommentId(commentId);

    if (!post) return null;

    await activityService.removeCommentActivity({
      commentId,
      ownerId: session.user.id,
    });
    await commentService.deleteComment(commentId, post.id);
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
