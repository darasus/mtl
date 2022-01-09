import { clientCacheKey } from '@mtl/cache';
import { days } from '@mtl/utils';
import { useQuery } from 'react-query';
import { useFetcher } from '../useFetcher';

export const useUserTagsQuery = ({ nickname }: { nickname: string }) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createUserTagsKey({ nickname }),
    () => fetcher.fetchUserTags({ nickname }),
    {
      enabled: !!nickname,
      staleTime: days(1),
      cacheTime: days(1),
    }
  );
};
