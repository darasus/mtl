import Prisma, { Like, User } from ".prisma/client";
import { Post } from "../../types/Post";
import * as R from "ramda";

export type InputPost = Prisma.Post & {
  likes: (Prisma.Like & { author: Omit<Prisma.User, "password"> | null })[];
  comments: Prisma.Comment[];
  commentsCount: number;
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
  author: Omit<Prisma.User, "password"> | null;
};

export const preparePost = (post: InputPost, userId?: string): Post => {
  const isLikedByMe = userId
    ? post.likes.some(
        (like: Like & { author: Omit<User, "password"> | null }) =>
          like.author?.id === userId
      )
    : false;

  return {
    ...R.omit(["likes"], post),
    likesCount: post.likes.length,
    isLikedByMe,
  };
};
