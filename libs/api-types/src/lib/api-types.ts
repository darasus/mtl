import { ApiPage, Post } from '@mtl/types';
import * as Prisma from '@prisma/client';

export type ApiResponse = {
  ['user/:nickname/posts']: ApiPage<Post>;
  ['user/:nickname/tags']: Prisma.Tag[];
  ['feed']: ApiPage<Post>;
};
