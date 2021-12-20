import {
  onPostsInfiniteQuerySuccess,
  getNextPageParam,
} from '../../lib/utils/queryCacheUtils';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { hours } from '../../utils/duration';
import { useFetcher } from '../useFetcher';
import { ApiResponse } from '@mtl/api-types';

export const useUserPostsQuery = ({ nickname }: { nickname: string }) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useInfiniteQuery<ApiResponse['user/:nickname/posts']>(
    clientCacheKey.createUserPostsKey({ nickname }),
    ({ pageParam = undefined }) =>
      fetcher.getUserPosts({ nickname, cursor: pageParam }),
    {
      enabled: !!nickname,
      staleTime: hours(1),
      getNextPageParam,
      onSuccess(data) {
        onPostsInfiniteQuerySuccess({ data, queryClient });
      },
    }
  );
};
