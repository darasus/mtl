import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

const toastConfig = {
  loading: "Marking all notifications as read...",
  success: "All notifications are marked as read!",
  error: "Notifications are not marked as read.",
};

export const useMarkAllActivityAsReadMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const me = useMe();

  return useMutation(
    () => withToast(fetcher.markAllActivityAsRead(), toastConfig),
    {
      async onSuccess() {
        await queryClient.invalidateQueries(
          clientCacheKey.createUserActivityKey(me?.user?.id as string)
        );
      },
    }
  );
};
