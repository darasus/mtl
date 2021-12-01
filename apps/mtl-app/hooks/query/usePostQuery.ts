import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { days } from "../../utils/duration";
import { useFetcher } from "../useFetcher";

export const usePostQuery = (postId: string) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const router = useRouter();
  const isUserPage = router.pathname === "/p/[id]";

  return useQuery(
    clientCacheKey.createPostKey(postId),
    () => fetcher.getPost(postId),
    {
      enabled: !!postId,
      staleTime: isUserPage ? 0 : days(1),
      onSuccess(data) {
        const comments = queryClient.getQueryData(
          clientCacheKey.createPostCommentsKey(postId)
        );

        if (!comments && data && data.comments.length > 0) {
          queryClient.setQueryData(
            clientCacheKey.createPostCommentsKey(data.id),
            {
              items: data.comments,
              count: data.comments.length,
              total: data.commentsCount,
            }
          );
        }
      },
    }
  );
};
