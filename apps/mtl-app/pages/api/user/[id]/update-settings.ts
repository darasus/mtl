import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import axios from "axios";
import invariant from "invariant";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserSession } from "../../../../lib/getUserSession";
import prisma from "../../../../lib/prisma";
import { UserService } from "../../../../lib/prismaServices/UserService";
import { processErrorResponse } from "../../../../utils/error";

export default withApiAuthRequired(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is required");

  const userService = new UserService();

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        nickname: req.body.nickname,
      },
      select: {
        nickname: true,
      },
    });

    if (existingUser && existingUser?.nickname === req.body.nickname) {
      return res.status(400).json({
        error: "User with this nickname already exists.",
      });
    }

    const token = await axios(`${process.env.AUTH0_API_BASE_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_API_BASE_URL}/api/v2/`,
      },
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return res.status(400).end(processErrorResponse(err));
      });

    const session = await getUserSession({ req, res });

    await axios(
      `${process.env.AUTH0_API_BASE_URL}/api/v2/users/${session.user.sub}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
        data: {
          picture: req.body.image,
          name: req.body.name,
          nickname: req.body.nickname,
          password: req.body.password,
          email: req.body.email,
        },
      }
    )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return res.status(400).end(processErrorResponse(err));
      });

    await userService.updateUserSettings({
      userId: req.query.id,
      image: req.body.image,
      name: req.body.name,
      nickname: req.body.nickname,
      password: req.body.password,
      email: req.body.email,
    });

    return res.json({});
  } catch (error) {
    return res.status(400).end(processErrorResponse(error));
  }
});
