// import * as Prisma from '@prisma/client';

import { BaseEntity } from './BaseEntity';

// export type User = Omit<Prisma.User, 'password'>;

export interface TUser extends BaseEntity {
  name: string;
  image: string;
  nickname: string;
  email: string;
  emailVerified: boolean;
  password: string;
  postIds: string[];
  commentIds: string[];
  likeIds: string;
  followerIds: string;
  followingIds: string;
}
