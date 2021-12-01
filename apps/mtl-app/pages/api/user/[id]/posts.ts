import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../../../../lib/prismaServices/UserService";
import { getUserSession } from "../../../../lib/getUserSession";
import { processErrorResponse } from "../../../../utils/error";

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
    const session = await getUserSession({ req, res });
    const userService = new UserService();
    const userId = req.query.id;
    const posts = await userService.getUserPosts(
      userId,
      session.user.id === userId
    );
    res.json(posts);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
