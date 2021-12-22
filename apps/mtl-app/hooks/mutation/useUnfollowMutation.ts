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

  return useMutation<unknown, unknown, { nickname: string }>(
    ({ nickname }) =>
      withToast(fetcher.unfollowUser({ nickname }), toastConfig),
    {
      onSuccess(_, { nickname }) {
        qc.invalidateQueries(
          clientCacheKey.createFollowersCountKey({ nickname })
        );
        qc.invalidateQueries(
          clientCacheKey.createFollowersCountKey({ nickname: me?.user?.id })
        );
        qc.invalidateQueries(
          clientCacheKey.createFollowingCountKey({ nickname })
        );
        qc.invalidateQueries(
          clientCacheKey.createFollowingCountKey({ nickname: me?.user?.id })
        );
        qc.invalidateQueries(
          clientCacheKey.createDoIFollowUserKey({ nickname })
        );
        qc.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
