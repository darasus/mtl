import Prisma from ".prisma/client";

export type Post = Prisma.Post & {
  author: Omit<Prisma.User, "password"> | null;
  commentsCount: number;
  likesCount: number;
  isLikedByMe: boolean;
  comments: Comment[];
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
};

export type Comment = Prisma.Comment & {
  author?: Omit<Prisma.User, "password"> | null;
};
