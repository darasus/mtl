import { Post } from '@mtl/types';
import * as Prisma from '@prisma/client';
import * as R from 'ramda';

export type InputPost = Prisma.Post & {
  likes: (Prisma.Like & { author: Omit<Prisma.User, 'password'> | null })[];
  comments: Prisma.Comment[];
  commentsCount: number;
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
  author: Omit<Prisma.User, 'password'> | null;
};

export const preparePost = (post: InputPost, userId?: string): Post => {
  const isLikedByMe = userId
    ? post.likes.some(
        (
          like: Prisma.Like & { author: Omit<Prisma.User, 'password'> | null }
        ) => like.author?.id === userId
      )
    : false;

  return {
    ...R.omit(['likes'], post),
    likesCount: post.likes.length,
    isLikedByMe,
  };
};
