import { useQuery } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { useFetcher } from '../useFetcher';

export const useScreenshotQuery = (postId: string) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createScreenshotKey(postId),
    () => fetcher.getScreenshot({ postId }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
};
