import { useQuery } from 'react-query';
import { clientCacheKey } from '@mtl/cache';
import { useFetcher } from '../useFetcher';
import { days } from '@mtl/utils';

export const useUserQuery = ({ nickname }: { nickname: string }) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createUserKey({ nickname }),
    () => fetcher.getUser({ nickname }),
    {
      staleTime: days(1),
      cacheTime: days(1),
    }
  );
};
