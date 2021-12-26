import { useMutation, useQueryClient } from 'react-query';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { withToast } from '../../utils/withToast';
import { useFetcher } from '../useFetcher';

const toastConfig = {
  loading: 'Deleting library...',
  success: 'Library is deleted!',
  error: 'Library is not deleted.',
};

export const usePostDeleteMutation = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(() => withToast(fetcher.deletePost(postId), toastConfig), {
    async onSettled() {
      await queryClient.removeQueries(clientCacheKey.createPostKey({ postId }));
      await queryClient.invalidateQueries(clientCacheKey.feedBaseKey);
      await queryClient.invalidateQueries(clientCacheKey.userPostsBaseKey);
    },
  });
};
