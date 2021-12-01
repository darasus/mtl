import { useMutation, useQueryClient } from "react-query";
import { useFetcher } from "../useFetcher";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";

const toastConfig = {
  loading: "Deleting comment...",
  success: "Comment deleted!",
  error: "Comment is not deleted.",
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    ({ commentId }: { commentId: string; postId: string }) =>
      withToast(fetcher.deleteComment(commentId), toastConfig),
    {
      onMutate: async ({ postId, commentId }) => {
        await queryClient.cancelQueries(
          clientCacheKey.createPostCommentsKey(postId)
        );

        const prev = queryClient.getQueryData(
          clientCacheKey.createPostCommentsKey(postId)
        );

        queryClient.setQueryData(
          clientCacheKey.createPostCommentsKey(postId),
          (old: any) => {
            return {
              ...old,
              items: old.items.filter(
                (comment: any) => comment.id !== commentId
              ),
            };
          }
        );

        return { prev };
      },
      onError: (_, { postId }, context: any) => {
        if (context?.prev) {
          queryClient.setQueryData(
            clientCacheKey.createPostCommentsKey(postId),
            context.prev
          );
        }
      },
      onSettled(_, __, { postId }) {
        queryClient.invalidateQueries(
          clientCacheKey.createPostCommentsKey(postId)
        );
        queryClient.invalidateQueries(clientCacheKey.createPostKey(postId));
      },
    }
  );
};
