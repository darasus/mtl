import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useFetcher } from '../useFetcher';
import { ApiResponse } from '@mtl/api-types';
import { FeedType } from '@mtl/types';
import {
  clientCacheKey,
  getNextPageParam,
  onPostsInfiniteQuerySuccess,
} from '@mtl/cache';
import { hours } from '@mtl/utils';

export const useFeedQuery = ({ feedType }: { feedType: FeedType }) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useInfiniteQuery<ApiResponse['user/:nickname/posts']>(
    clientCacheKey.createFeedKey({ feedType }),
    ({ pageParam = undefined }) =>
      fetcher.getFeed({ feedType, cursor: pageParam }),
    {
      staleTime: hours(1),
      getNextPageParam,
      onSuccess(data) {
        onPostsInfiniteQuerySuccess({ data, queryClient });
      },
    }
  );
};
