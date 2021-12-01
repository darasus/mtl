import { useQuery } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { days } from "../../utils/duration";
import { useFetcher } from "../useFetcher";

export const useFollowersCountQuery = (userId: string) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createFollowersCountKey(userId),
    () => fetcher.getFollowersCount(userId),
    {
      staleTime: days(1),
    }
  );
};
