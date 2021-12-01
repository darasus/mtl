import { getSession, Session } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export const getUserSession = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = getSession(req, res);
  return {
    ...session,
    user: { ...(session?.user || {}), id: session?.user?.sub?.split("|")[1] },
  } as Session & {
    user: {
      nickname: string;
      name: string;
      picture: string;
      updated_at: string;
      email: string;
      sub: string;
      id: string;
    };
  };
};
