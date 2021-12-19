import { useMutation, useQueryClient } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { withToast } from '../../utils/withToast';
import { useFetcher } from '../useFetcher';
import { useMe } from '../useMe';

const toastConfig = {
  loading: 'Unfollowing user...',
  success: 'User is unfollowed!',
  error: 'User is not unfollowed.',
};

export const useUnfollowMutation = () => {
  const qc = useQueryClient();
  const fetcher = useFetcher();
  const me = useMe();

  return useMutation<unknown, unknown, { userId: string }>(
    ({ userId }) => withToast(fetcher.unfollowUser(userId), toastConfig),
    {
      onSuccess(_, { userId }) {
        qc.invalidateQueries(clientCacheKey.createFollowersCountKey(userId));
        qc.invalidateQueries(
          clientCacheKey.createFollowersCountKey(me.user.id)
        );
        qc.invalidateQueries(clientCacheKey.createFollowingCountKey(userId));
        qc.invalidateQueries(
          clientCacheKey.createFollowingCountKey(me.user.id)
        );
        qc.invalidateQueries(clientCacheKey.createDoIFollowUserKey(userId));
        qc.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
