import * as Prisma from '@prisma/client';
import { TComment } from './TComment';
import { TUser } from './TUser';

export type TPost = Prisma.Post & {
  author: TUser;
  commentsCount: number;
  likesCount: number;
  isLikedByMe: boolean;
  comments: TComment[];
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
  isMyPost: boolean;
};
