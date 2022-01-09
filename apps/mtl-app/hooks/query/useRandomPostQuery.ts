import { days } from '@mtl/utils';
import { useQuery } from 'react-query';
import { useFetcher } from '../useFetcher';

export const useRandomPostQuery = () => {
  const fetcher = useFetcher();

  return useQuery('random-post', () => fetcher.getRandomPost(), {
    keepPreviousData: true,
    staleTime: days(1),
  });
};
