import { useQuery } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { days } from '../../utils/duration';
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
