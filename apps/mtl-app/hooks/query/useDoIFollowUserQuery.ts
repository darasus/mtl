import { clientCacheKey } from '@mtl/cache';
import { days } from '@mtl/utils';
import { useQuery } from 'react-query';
import { useFetcher } from '../useFetcher';

export const useDoIFollowUserQuery = ({ nickname }: { nickname: string }) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createDoIFollowUserKey({ nickname }),
    () => fetcher.doIFollowUser({ nickname }),
    {
      staleTime: days(1),
    }
  );
};
