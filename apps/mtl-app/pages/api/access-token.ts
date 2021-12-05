import invariant from 'invariant';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FeedService } from '../../lib/prismaServices/FeedService';
import { getUserSession } from '../../lib/getUserSession';
import { FeedType } from '../../types/FeedType';
import { processErrorResponse } from '../../utils/error';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === 'GET',
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const session = await getUserSession({ req, res });

    return res.send({ accessToken: session?.accessToken || null });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
