import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

export const createIsFirstServerCall = (
  ctx: GetServerSidePropsContext<ParsedUrlQuery>
) => {
  return ctx?.req.url?.indexOf("/_next/data/") === -1;
};
