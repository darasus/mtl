import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";

import { useFetcher } from "../useFetcher";

const toastConfig = {
  loading: "Unfollowing user...",
  success: "User is unfollowed!",
  error: "User is not unfollowed.",
};

export const useUnfollowMutation = () => {
  const qc = useQueryClient();
  const fetcher = useFetcher();

  return useMutation<unknown, unknown, { userId: string }>(
    ({ userId }) => withToast(fetcher.unfollowUser(userId), toastConfig),
    {
      onSuccess(_, { userId }) {
        qc.invalidateQueries(clientCacheKey.createFollowersCountKey(userId));
        qc.invalidateQueries(clientCacheKey.createDoIFollowUserKey(userId));
      },
    }
  );
};
