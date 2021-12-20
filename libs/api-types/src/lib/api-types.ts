import { ApiPage, Post } from '@mtl/types';

export type ApiResponse = {
  ['user/:nickname/posts']: ApiPage<Post>;
  ['feed']: ApiPage<Post>;
};
