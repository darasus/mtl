import { useQuery } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { days } from "../../utils/duration";
import { useFetcher } from "../useFetcher";

export const useDoIFollowUserQuery = (userId: string) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createDoIFollowUserKey(userId),
    () => fetcher.doIFollowUser(userId),
    {
      staleTime: days(1),
    }
  );
};
