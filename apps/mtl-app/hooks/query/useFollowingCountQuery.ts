import { useQuery } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { days } from '../../utils/duration';
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
