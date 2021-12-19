import { ApiPage, Post } from '@mtl/types';
import { InfiniteData, QueryClient } from 'react-query';
import { clientCacheKey } from '../ClientCacheKey';

export const onPostsInfiniteQuerySuccess = ({
  data,
  queryClient,
}: {
  data: InfiniteData<ApiPage<Post>>;
  queryClient: QueryClient;
}) => {
  data.pages?.forEach((page) => {
    page.items?.forEach((post) => {
      const postCache = queryClient.getQueryData(
        clientCacheKey.createPostKey(post.id)
      );
      const postCommentsCache = queryClient.getQueryData(
        clientCacheKey.createPostCommentsKey(post.id)
      );

      if (!postCache) {
        queryClient.setQueryData(clientCacheKey.createPostKey(post.id), post);
      }

      if (!postCommentsCache) {
        queryClient.setQueryData(
          clientCacheKey.createPostCommentsKey(post.id),
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
