import { clientCacheKey } from '@mtl/cache';
import { NonCursorApiPages, TComment } from '@mtl/types';
import { useMutation, useQueryClient } from 'react-query';
import { withToast } from '../../utils/withToast';
import { useFetcher } from '../useFetcher';
import { useMe } from '../useMe';

type Variables = { postId: string; content: string; take: number };

const toastConfig = {
  loading: 'Posting comment...',
  success: 'Comment posted!',
  error: 'Comment is not posted.',
};

type Data = NonCursorApiPages<TComment> | undefined;

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();
  const me = useMe();
  const fetcher = useFetcher();

  return useMutation<
    TComment,
    unknown,
    Variables,
    {
      prev: Data;
    }
  >(
    'jello',
    ({ postId, content }: Variables) =>
      withToast(fetcher.addComment({ postId, content }), toastConfig),
    {
      onMutate: async ({ postId, content }) => {
        await queryClient.cancelQueries(
          clientCacheKey.createPostCommentsKey({ postId })
        );

        const prev = queryClient.getQueryData<Data>(
          clientCacheKey.createPostCommentsKey({ postId })
        );

        queryClient.setQueryData<Data>(
          clientCacheKey.createPostCommentsKey({ postId }),
          (old) => {
            return {
              total: 0,
              count: 0,
              ...old,
              items: [
                ...(old?.items || []),
                {
                  author: {
                    id: me?.user?.id as string,
                    email: me?.user?.email as string,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    nickname: me?.user?.nickname as string,
                    image: me?.user?.picture as string,
                    emailVerified: false,
                    name: me?.user?.name as string,
                  },
                  authorId: me?.user?.id as string,
                  content,
                  createdAt: new Date(),
                  id: Math.random().toString(),
                  postId,
                  updatedAt: new Date(),
                },
              ],
            };
          }
        );

        return { prev };
      },
      onError: (_, { postId }, context) => {
        if (context?.prev) {
          queryClient.setQueryData(
            clientCacheKey.createPostCommentsKey({ postId }),
            context.prev
          );
        }
      },
      async onSettled(_, __, { postId }) {
        await queryClient.invalidateQueries(
          clientCacheKey.createPostCommentsKey({ postId })
        );
        await queryClient.invalidateQueries(
          clientCacheKey.createPostKey({ postId })
        );
      },
    }
  );
};
