import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

const toastConfig = {
  loading: "Unliking...",
  success: "Unliked!",
  error: "Did not unlike.",
};

export const usePostUnlikeMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation<unknown, unknown, { postId: string }>(
    ({ postId }) => withToast(fetcher.unlikePost(postId), toastConfig),
    {
      onMutate: async ({ postId }) => {
        await queryClient.cancelQueries(clientCacheKey.createPostKey(postId));

        const prev = queryClient.getQueryData(
          clientCacheKey.createPostKey(postId)
        );

        queryClient.setQueryData(
          clientCacheKey.createPostKey(postId),
          (old: any) => {
            return {
              ...old,
              likesCount: old.likesCount - 1,
              isLikedByMe: false,
            };
          }
        );

        return { prev };
      },
      onError: (_, { postId }, context: any) => {
        if (context?.prev) {
          queryClient.setQueryData(
            clientCacheKey.createPostKey(postId),
            context.prev
          );
        }
      },
      onSettled(_, __, { postId }) {
        queryClient.invalidateQueries(clientCacheKey.createPostKey(postId));
      },
    }
  );
};
