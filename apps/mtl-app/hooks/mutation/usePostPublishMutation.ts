import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

const toastConfig = {
  loading: "Publishing library...",
  success: "Library is published!",
  error: "Library is not published.",
};

export const usePostPublishMutation = (postId: string) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    () => withToast(fetcher.publishPost(postId), toastConfig),
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
