import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

const toastConfig = {
  loading: "Following user...",
  success: "User is followed!",
  error: "User is not followed.",
};

export const useFollowMutation = () => {
  const qc = useQueryClient();
  const fetcher = useFetcher();

  return useMutation<unknown, unknown, { userId: string }>(
    ({ userId }) => withToast(fetcher.followUser(userId), toastConfig),
    {
      onSuccess(_, { userId }) {
        qc.invalidateQueries(clientCacheKey.createFollowersCountKey(userId));
        qc.invalidateQueries(clientCacheKey.createDoIFollowUserKey(userId));
        qc.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
