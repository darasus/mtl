import { Request } from 'express';

export const getMyIdByReq = (req: Request) => {
  return req?.user?.sub?.split('|')?.[1];
};
