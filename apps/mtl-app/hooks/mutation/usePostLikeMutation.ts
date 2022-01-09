import { useMutation, useQueryClient } from 'react-query';
import { useFetcher } from '../useFetcher';
import { clientCacheKey } from '@mtl/cache';
import { withToast } from '../../utils/withToast';
import { useRouter } from 'next/router';

const toastConfig = {
  loading: 'Liking...',
  success: 'Liked!',
  error: 'Did not like.',
};

export const usePostLikeMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const router = useRouter();

  return useMutation(
    ({ postId }: { postId: string }) =>
      withToast(fetcher.likePost({ postId }), toastConfig),
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
              likesCount: old.likesCount + 1,
              isLikedByMe: true,
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
