import * as Prisma from '@prisma/client';
import { TComment } from './TComment';

export type TPost = Prisma.Post & {
  author: Omit<Prisma.User, 'password'> | null;
  commentsCount: number;
  likesCount: number;
  isLikedByMe: boolean;
  comments: TComment[];
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
};
