import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

export const useMarkActivityAsReadMutation = (activityId: string) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const me = useMe();

  return useMutation(() => fetcher.markActivityAsRead(activityId), {
    async onSettled() {
      await queryClient.invalidateQueries(
        clientCacheKey.createUserActivityKey(me?.user?.id as string)
      );
    },
  });
};
