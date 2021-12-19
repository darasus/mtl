import { ApiPage, Post } from '@mtl/types';

export type ApiResponse = {
  ['user/:userId/posts']: ApiPage<Post>;
  ['feed']: ApiPage<Post>;
};
