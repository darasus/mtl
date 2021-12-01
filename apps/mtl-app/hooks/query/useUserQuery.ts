import { useQuery } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const useUserQuery = (userId: string) => {
  const fetcher = useFetcher();

  return useQuery(clientCacheKey.createUserKey(userId), () =>
    fetcher.getUser(userId)
  );
};
