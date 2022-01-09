import { clientCacheKey } from './ClientCacheKey';
import { ApiPage, TPost } from '@mtl/types';
import { InfiniteData, QueryClient } from 'react-query';

export const onPostsInfiniteQuerySuccess = ({
  data,
  queryClient,
}: {
  data: InfiniteData<ApiPage<TPost>>;
  queryClient: QueryClient;
}) => {
  data.pages?.forEach((page) => {
    page.items?.forEach((post) => {
      const postCache = queryClient.getQueryData(
        clientCacheKey.createPostKey({ postId: post.id })
      );
      const postCommentsCache = queryClient.getQueryData(
        clientCacheKey.createPostCommentsKey({ postId: post.id })
      );

      if (!postCache) {
        queryClient.setQueryData(
          clientCacheKey.createPostKey({ postId: post.id }),
          post
        );
      }

      if (!postCommentsCache) {
        queryClient.setQueryData(
          clientCacheKey.createPostCommentsKey({ postId: post.id }),
          {
            items: post.comments,
            count: post.comments.length,
            total: post.commentsCount,
          }
        );
      }
    });
  });
};
