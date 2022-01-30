// import * as Prisma from '@prisma/client';
import { CodeLanguage } from '@prisma/client';
import { BaseEntity } from './BaseEntity';
import { TComment } from './TComment';
import { TTag } from './TTag';
import { TUser } from './TUser';

// export type TPost = Prisma.Post & {
//   author: Omit<Prisma.User, 'password'> | null;
//   commentsCount: number;
//   likesCount: number;
//   isLikedByMe: boolean;
//   comments: TComment[];
//   tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
// };

export interface TPost extends BaseEntity {
  title: string;
  content: string;
  description: string;
  published: boolean;
  // authorId: string;
  codeLanguage: CodeLanguage;
  // likeIds: string[];
  // commentIds: string[];
  // tagIds: string[];
  author: TUser;
  tags: TTag[];
  comments: TComment[];
  commentsCount: number;
  likesCount: number;
  isLikedByMe: boolean;
}
