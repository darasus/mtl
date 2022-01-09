import { ApiPage, TPost } from '@mtl/types';
import { InfiniteData, QueryClient } from 'react-query';
import { clientCacheKey } from '../lib/ClientCacheKey';

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

export const getNextPageParam = (lastPage, pages) => {
  const localTotal = pages
    .map((page) => page.count)
    .reduce((prev, next) => prev + next, 0);

  if (localTotal === lastPage.total) return undefined;

  return lastPage.cursor;
};
