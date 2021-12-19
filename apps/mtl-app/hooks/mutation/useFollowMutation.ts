import { useMutation, useQueryClient } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { withToast } from '../../utils/withToast';
import { useFetcher } from '../useFetcher';
import { useMe } from '../useMe';

const toastConfig = {
  loading: 'Following user...',
  success: 'User is followed!',
  error: 'User is not followed.',
};

export const useFollowMutation = () => {
  const qc = useQueryClient();
  const fetcher = useFetcher();
  const me = useMe();

  return useMutation<unknown, unknown, { userId: string }>(
    ({ userId }) => withToast(fetcher.followUser(userId), toastConfig),
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
