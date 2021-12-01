import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { CommentService } from "../../../../lib/prismaServices/CommentService";
import { processErrorResponse } from "../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "ID is missing");

  try {
    const postService = new CommentService();
    const comments = await postService.getCommentsByPostId({
      postId: req.query.id,
      take: Number(req.query.take) || undefined,
      skip: Number(req.query.cursor) || undefined,
    });
    res.json(comments);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
