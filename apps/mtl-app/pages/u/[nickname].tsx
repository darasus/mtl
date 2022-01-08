import React from 'react';
import { Box } from '@chakra-ui/react';
import { useUserQuery } from '../../hooks/query/useUserQuery';
import { Layout } from '../../layouts/Layout';
import { Head } from '../../components/Head';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { getSession } from '@auth0/nextjs-auth0';
import { createIsFirstServerCall } from '../../utils/createIsFirstServerCall';
import { HttpConnector } from '../../lib/HttpConnector';
import { Fetcher } from '../../lib/Fetcher';
import { clientCacheKey } from '../../lib/ClientCacheKey';
import { getPlaiceholder, IGetPlaiceholderReturn } from 'plaiceholder';
import { User } from '@mtl/types';
import { rejectNil } from '../../utils/rejectNil';
import { UserProfile } from '../../features/UserProfile';
import { UserProfileTabs } from '../../features/UserProfileTabs';
import { useUserPostsQuery } from '../../hooks/query/useUserPostsQuery';
import { PostList } from '../../components/PostList';
import { TPost } from '../../types/Post';
import { useRouter } from 'next/router';

interface Props {
  userProfileImageBase64: string | undefined;
}

const UserPage: React.FC<Props> = ({ userProfileImageBase64 }) => {
  const router = useRouter();
  const user = useUserQuery({ nickname: router.query.nickname as string });
  const postsData = useUserPostsQuery({
    nickname: router.query.nickname as string,
  });
  const posts = React.useMemo(
    () =>
      (postsData.data?.pages || []).reduce((acc, page) => {
        return [...acc, ...page.items];
      }, [] as TPost[]),
    [postsData.data?.pages]
  );

  return (
    <>
      <Head title={user.data?.name as string} urlPath={`u/${user.data?.id}`} />
      <Layout>
        <Box>
          <UserProfile userProfileImageBase64={userProfileImageBase64} />
        </Box>
        <Box>
          <UserProfileTabs />
          <PostList
            posts={posts}
            fetchNextPage={postsData.fetchNextPage}
            hasNextPage={postsData.hasNextPage}
            isFetchingNextPage={postsData.isFetchingNextPage}
            isLoading={postsData.isLoading}
          />
        </Box>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const session = await getSession(ctx.req, ctx.res);

  if (!createIsFirstServerCall(ctx)) {
    return {
      props: {
        accessToken: session?.accessToken || null,
        cookies: ctx.req?.headers?.cookie ?? '',
        user: session?.user || undefined,
      },
    };
  }

  const httpConnector = new HttpConnector();
  const fetcher = new Fetcher(httpConnector);
  const nickname = ctx.query.nickname as string;

  let user: User | undefined;

  try {
    user = await fetcher.getUser({ nickname });

    await Promise.all([
      queryClient.prefetchQuery(
        clientCacheKey.createUserKey({ nickname }),
        () => Promise.resolve(user)
      ),
      queryClient.prefetchQuery(
        clientCacheKey.createFollowersCountKey({ nickname }),
        () => fetcher.getFollowersCount({ nickname })
      ),
      queryClient.prefetchQuery(
        clientCacheKey.createFollowingCountKey({ nickname }),
        () => fetcher.getFollowingsCount({ nickname })
      ),
      queryClient.prefetchQuery(
        clientCacheKey.createUserTagsKey({ nickname }),
        () => fetcher.fetchUserTags({ nickname })
      ),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404) {
      return {
        notFound: true,
      };
    }
  }

  let userImage: IGetPlaiceholderReturn | null = null;
  if (user?.image) {
    userImage = await getPlaiceholder(user?.image, { size: 16 });
  }

  return {
    props: rejectNil({
      dehydratedState: dehydrate(queryClient),
      accessToken: session?.accessToken || null,
      cookies: ctx.req?.headers?.cookie ?? '',
      user: session?.user || null,
      userProfileImageBase64: userImage?.base64,
    }),
  };
};

export default UserPage;
