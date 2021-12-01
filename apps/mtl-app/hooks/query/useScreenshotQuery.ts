import { useQuery } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const useScreenshotQuery = (url: string) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createScreenshotKey(url),
    () => fetcher.getScreenshot({ url }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
};
