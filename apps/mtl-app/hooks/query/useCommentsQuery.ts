import { useQuery } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { days } from "../../utils/duration";
import { useFetcher } from "../useFetcher";

export const useCommentsQuery = ({
  postId,
  take,
}: {
  postId: string;
  take: number;
}) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createPostCommentsKey(postId),
    () => fetcher.getComments({ postId, take }),
    {
      enabled: !!postId,
      keepPreviousData: true,
      staleTime: days(1),
    }
  );
};
