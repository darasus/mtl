import { clientCacheKey } from '@mtl/cache';
import { days } from '@mtl/utils';
import { useQuery } from 'react-query';
import { useFetcher } from '../useFetcher';

export const useFollowingCountQuery = ({ nickname }: { nickname: string }) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createFollowingCountKey({ nickname }),
    () => fetcher.getFollowingsCount({ nickname }),
    {
      staleTime: days(1),
    }
  );
};
