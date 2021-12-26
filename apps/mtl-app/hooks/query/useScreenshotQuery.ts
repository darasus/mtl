import { useQuery } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { useFetcher } from '../useFetcher';

export const useScreenshotQuery = ({
  postId,
  updateDate,
}: {
  postId: string;
  updateDate: Date;
}) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createScreenshotKey({ postId, updateDate }),
    () => fetcher.getScreenshot({ postId, updateDate }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
};
