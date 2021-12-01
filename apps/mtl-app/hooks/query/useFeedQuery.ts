import { useInfiniteQuery, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { FeedType } from "../../types/FeedType";
import { hours } from "../../utils/duration";
import { useFetcher } from "../useFetcher";

export const useFeedQuery = ({ feedType }: { feedType: FeedType }) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useInfiniteQuery(
    clientCacheKey.createFeedKey(feedType),
    ({ pageParam = undefined }) =>
      fetcher.getFeed({ feedType, cursor: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        const localTotal = pages
          .map((page) => page.count)
          .reduce((prev, next) => prev + next, 0);

        if (localTotal === lastPage.total) return undefined;

        return lastPage.cursor;
      },
      staleTime: hours(1),
      onSuccess(data) {
        data.pages?.forEach((page) => {
          page.items?.forEach((post) => {
            const postCache = queryClient.getQueryData(
              clientCacheKey.createPostKey(post.id)
            );
            const postCommentsCache = queryClient.getQueryData(
              clientCacheKey.createPostCommentsKey(post.id)
            );

            if (!postCache) {
              queryClient.setQueryData(
                clientCacheKey.createPostKey(post.id),
                post
              );
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
      },
    }
  );
};
