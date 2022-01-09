import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useFetcher } from '../useFetcher';
import { ApiResponse } from '@mtl/api-types';
import { userPostsFilterAtom } from '../../atoms/userPostsFilterAtom';
import { useRecoilState } from 'recoil';
import {
  clientCacheKey,
  onPostsInfiniteQuerySuccess,
  getNextPageParam,
} from '@mtl/cache';
import { hours } from '@mtl/utils';

export const useUserPostsQuery = ({ nickname }: { nickname: string }) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const [userPostsFilter] = useRecoilState(userPostsFilterAtom);

  return useInfiniteQuery<ApiResponse['user/:nickname/posts']>(
    clientCacheKey.createUserPostsKey({
      nickname,
      tags: userPostsFilter.tags,
      published: userPostsFilter.published,
    }),
    ({ pageParam = undefined }) =>
      fetcher.getUserPosts({
        nickname,
        cursor: pageParam,
        tags: userPostsFilter.tags,
        published: userPostsFilter.published,
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
