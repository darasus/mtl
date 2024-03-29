import { clientCacheKey } from '@mtl/cache';
import { days } from '@mtl/utils';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import { useFetcher } from '../useFetcher';

export const usePostQuery = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const router = useRouter();
  const isUserPage = router.pathname === '/p/[id]';

  return useQuery(
    clientCacheKey.createPostKey({ postId }),
    () => fetcher.getPost({ postId }),
    {
      enabled: !!postId,
      staleTime: isUserPage ? 0 : days(1),
      onSuccess(data) {
        const comments = queryClient.getQueryData(
          clientCacheKey.createPostCommentsKey({ postId })
        );

        if (!comments && data && data.comments.length > 0) {
          queryClient.setQueryData(
            clientCacheKey.createPostCommentsKey({ postId: data.id }),
            {
              items: data.comments,
              count: data.comments.length,
              total: data.commentsCount,
            }
          );
        }
      },
    }
  );
};
