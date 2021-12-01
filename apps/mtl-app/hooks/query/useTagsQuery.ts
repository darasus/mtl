import { useQuery } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { days } from "../../utils/duration";
import { useFetcher } from "../useFetcher";

export const useTagsQuery = () => {
  const fetcher = useFetcher();

  return useQuery(clientCacheKey.tagsBaseKey, () => fetcher.getAllTags(), {
    staleTime: days(1),
  });
};
