import { useQuery } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { days } from '../../utils/duration';
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
