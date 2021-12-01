import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { TagService } from "../../../lib/prismaServices/TagService";
import { processErrorResponse } from "../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const tagService = new TagService();
    const tags = await tagService.getAllTags();
    res.send(tags);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
