import { Request } from '@mtl/types';

export const getMyIdByReq = (req: Request) => {
  return req?.user?.sub?.split('|')?.[1];
};
