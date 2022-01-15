// import * as Prisma from '@prisma/client';

import { BaseEntity } from './BaseEntity';
import { TUser } from './TUser';

// export type TComment = Prisma.Comment & {
//   author?: Omit<Prisma.User, 'password'> | null;
// };

export interface TComment extends BaseEntity {
  postId: string;
  authorId: string;
  content: string;
  author: TUser;
}
