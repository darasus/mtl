import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
import invariant from "invariant";
import { NextApiRequest, NextApiResponse } from "next";
import { Fetcher } from "../../lib/Fetcher";
import { ServerHttpConnector } from "../../lib/ServerHttpConnector";

export const config = {
  api: {
    bodyParser: false,
  },
};

const getResponse = (req: NextApiRequest) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const image = fs.createReadStream(files.file.filepath);
      const data = new FormData();
      data.append("file", image);
      const fetcher = new Fetcher(new ServerHttpConnector({ req }));

      try {
        const response = await fetcher.uploadImageToCloudFlare(
          data,
          data.getHeaders()
        );
        return resolve(response);
      } catch (error) {
        return reject(error);
      }
    });
  });
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const response = await getResponse(req);

  return res.json(response);
}
