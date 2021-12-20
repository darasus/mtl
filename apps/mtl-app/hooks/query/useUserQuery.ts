import { useQuery } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { useFetcher } from '../useFetcher';

export const useUserQuery = ({ nickname }: { nickname: string }) => {
  const fetcher = useFetcher();

  return useQuery(clientCacheKey.createUserKey({ nickname }), () =>
    fetcher.getUser({ nickname })
  );
};
