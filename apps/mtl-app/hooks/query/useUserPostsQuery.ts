import {
  onPostsInfiniteQuerySuccess,
  getNextPageParam,
} from '../../lib/utils/queryCacheUtils';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { hours } from '../../utils/duration';
import { useFetcher } from '../useFetcher';
import { ApiResponse } from '@mtl/api-types';

export const useUserPostsQuery = (userId: string) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useInfiniteQuery<ApiResponse['user/:userId/posts']>(
    clientCacheKey.createUserPostsKey(userId),
    ({ pageParam = undefined }) =>
      fetcher.getUserPosts({ userId, cursor: pageParam }),
    {
      enabled: !!userId,
      staleTime: hours(1),
      getNextPageParam,
      onSuccess(data) {
        onPostsInfiniteQuerySuccess({ data, queryClient });
      },
    }
  );
};
