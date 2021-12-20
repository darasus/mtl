import { useInfiniteQuery } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { days } from '../../utils/duration';
import { useFetcher } from '../useFetcher';

export const useUserActivityQuery = ({ nickname }: { nickname: string }) => {
  const fetcher = useFetcher();

  return useInfiniteQuery(
    clientCacheKey.createUserActivityKey({ nickname }),
    ({ pageParam = undefined }) =>
      fetcher.getUserActivity({ nickname, cursor: pageParam }),
    {
      staleTime: days(1),
      enabled: !!nickname,
      getNextPageParam: (lastPage, pages) => {
        const localTotal = pages
          .map((page) => page.count)
          .reduce((prev, next) => prev + next, 0);

        if (localTotal === lastPage.total) return undefined;

        return lastPage.cursor;
      },
    }
  );
};
