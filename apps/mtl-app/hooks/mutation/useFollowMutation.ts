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

  return useMutation<unknown, unknown, { nickname: string }>(
    ({ nickname }) => withToast(fetcher.followUser({ nickname }), toastConfig),
    {
      onSuccess(_, { nickname }) {
        qc.invalidateQueries(
          clientCacheKey.createFollowersCountKey({ nickname })
        );
        qc.invalidateQueries(
          clientCacheKey.createFollowersCountKey({ nickname: me.user.nickname })
        );
        qc.invalidateQueries(
          clientCacheKey.createFollowingCountKey({ nickname })
        );
        qc.invalidateQueries(
          clientCacheKey.createFollowingCountKey({ nickname: me.user.nickname })
        );
        qc.invalidateQueries(
          clientCacheKey.createDoIFollowUserKey({ nickname })
        );
        qc.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
