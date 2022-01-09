import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { clientCacheKey } from '@mtl/cache';
import { withToast } from '../../utils/withToast';
import { useFetcher } from '../useFetcher';

const toastConfig = {
  loading: 'Unliking...',
  success: 'Unliked!',
  error: 'Did not unlike.',
};

export const usePostUnlikeMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const router = useRouter();

  return useMutation<unknown, unknown, { postId: string }>(
    ({ postId }) => withToast(fetcher.unlikePost({ postId }), toastConfig),
    {
      onMutate: async ({ postId }) => {
        await queryClient.cancelQueries(
          clientCacheKey.createPostKey({ postId })
        );

        const prev = queryClient.getQueryData(
          clientCacheKey.createPostKey({ postId })
        );

        queryClient.setQueryData(
          clientCacheKey.createPostKey({ postId }),
          (old: any) => {
            return {
              ...old,
              likesCount: old.likesCount - 1,
              isLikedByMe: false,
            };
          }
        );

        return { prev };
      },
      onError: (_, { postId }, context: any) => {
        if (context?.prev) {
          queryClient.setQueryData(
            clientCacheKey.createPostKey({ postId }),
            context.prev
          );
        }
      },
      async onSettled(_, __, { postId }) {
        if (router.pathname === '/p/[id]') {
          await queryClient.invalidateQueries(
            clientCacheKey.createPostKey({ postId })
          );
        }
        if (router.pathname === '/u/[nickname]') {
          await queryClient.invalidateQueries(clientCacheKey.userPostsBaseKey);
        }
      },
    }
  );
};
