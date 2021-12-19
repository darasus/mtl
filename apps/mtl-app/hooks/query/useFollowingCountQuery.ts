import { useQuery } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { days } from '../../utils/duration';
import { useFetcher } from '../useFetcher';

export const useFollowingCountQuery = (userId: string) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createFollowingCountKey(userId),
    () => fetcher.getFollowingsCount(userId),
    {
      staleTime: days(1),
    }
  );
};
