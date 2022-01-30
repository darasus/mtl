import { clientCacheKey } from '@mtl/cache';
import { days } from '@mtl/utils';
import { useInfiniteQuery } from 'react-query';
import { useFetcher } from '../useFetcher';

export const useUserActivityQuery = ({ nickname }: { nickname: string }) => {
  const fetcher = useFetcher();

  return useInfiniteQuery(
    clientCacheKey.createUserActivityKey({ nickname }),
    ({ pageParam: page = undefined }) =>
      fetcher.getUserActivity({
        nickname,
        page,
      }),
    {
      staleTime: days(1),
      enabled: !!nickname,
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage.nextPage) return undefined;

        return lastPage.nextPage;
      },
    }
  );
};
