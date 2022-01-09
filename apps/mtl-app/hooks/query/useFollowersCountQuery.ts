import { clientCacheKey } from '@mtl/cache';
import { days } from '@mtl/utils';
import { useQuery } from 'react-query';
import { useFetcher } from '../useFetcher';

export const useFollowersCountQuery = ({ nickname }: { nickname: string }) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createFollowersCountKey({ nickname }),
    () => fetcher.getFollowersCount({ nickname }),
    {
      staleTime: days(1),
    }
  );
};
