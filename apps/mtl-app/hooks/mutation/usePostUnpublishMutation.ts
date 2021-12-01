import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

const toastConfig = {
  loading: "Unpublishing library...",
  success: "Library is unpublished!",
  error: "Library is not unpublished.",
};

export const usePostUnpublishMutation = (postId: string) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    () => withToast(fetcher.unpublishPost(postId), toastConfig),
    {
      async onSettled() {
        await queryClient.invalidateQueries(
          clientCacheKey.createPostKey(postId)
        );
        await queryClient.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
