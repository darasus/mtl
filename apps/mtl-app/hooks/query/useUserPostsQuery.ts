import {
  onPostsInfiniteQuerySuccess,
  getNextPageParam,
} from '../../lib/utils/queryCacheUtils';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { hours } from '../../utils/duration';
import { useFetcher } from '../useFetcher';
import { ApiResponse } from '@mtl/api-types';
import { userTagFilterAtom } from '../../atoms/userTagFilterAtom';
import { useRecoilState } from 'recoil';

export const useUserPostsQuery = ({ nickname }: { nickname: string }) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const [userTagFilter] = useRecoilState(userTagFilterAtom);

  return useInfiniteQuery<ApiResponse['user/:nickname/posts']>(
    clientCacheKey.createUserPostsKey({
      nickname,
      tags: userTagFilter,
    }),
    ({ pageParam = undefined }) =>
      fetcher.getUserPosts({
        nickname,
        cursor: pageParam,
        tags: userTagFilter,
      }),
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
