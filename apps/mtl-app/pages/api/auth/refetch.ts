import { handleProfile } from '@auth0/nextjs-auth0';
import { processErrorResponse } from '@mtl/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function refetch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await handleProfile(req, res, {
      refetch: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).end(processErrorResponse(error));
  }
}
