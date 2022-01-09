import { clientCacheKey } from '@mtl/cache';
import { days } from '@mtl/utils';
import { useQuery } from 'react-query';
import { useFetcher } from '../useFetcher';

export const useTagsQuery = () => {
  const fetcher = useFetcher();

  return useQuery(clientCacheKey.tagsBaseKey, () => fetcher.getAllTags(), {
    staleTime: days(1),
  });
};
