import { ManagementClient } from "auth0";

export const auth0 = new ManagementClient({
  domain: process.env.AUTH0_ISSUER_BASE_URL as string,
  token: process.env.AUTH0_CLIENT_ID as string,
  clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
});
