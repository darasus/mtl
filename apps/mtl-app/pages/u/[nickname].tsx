import React from 'react';
import { Post } from '../../components/Post';
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Spinner,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useUserQuery } from '../../hooks/query/useUserQuery';
import { useRouter } from 'next/router';
import { useUserPostsQuery } from '../../hooks/query/useUserPostsQuery';
import { useFollowMutation } from '../../hooks/mutation/useFollowMutation';
import { useFollowersCountQuery } from '../../hooks/query/useFollowersCountQuery';
import { useUnfollowMutation } from '../../hooks/mutation/useUnfollowMutation';
import { useDoIFollowUserQuery } from '../../hooks/query/useDoIFollowUserQuery';
import { Layout } from '../../layouts/Layout';
import { Head } from '../../components/Head';
import { Heading } from '../../components/Heading';
import { useMe } from '../../hooks/useMe';
import { useFollowingCountQuery } from '../../hooks/query/useFollowingCountQuery';
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
import { UserTagCloud } from '../../features/UserTagCloud';
import { UserProfile } from '../../features/UserProfile';

interface Props {
  userProfileImageBase64: string | undefined;
}

const UserPage: React.FC<Props> = ({ userProfileImageBase64 }) => {
  const router = useRouter();
  const nickname = router.query.nickname as string;
  const user = useUserQuery({ nickname });
  const me = useMe();
  const posts = useUserPostsQuery({ nickname });

  return (
    <>
      <Head title={user.data?.name as string} urlPath={`u/${user.data?.id}`} />
      <Layout>
        <Box>
          <UserProfile userProfileImageBase64={userProfileImageBase64} />
        </Box>
        <Box>
          <Heading title="My libraries" />
          <UserTagCloud />
          {posts.isLoading && (
            <Flex justifyContent="center">
              <Spinner />
            </Flex>
          )}
          {posts.data?.pages.map((page) => {
            return page.items.map((post) => (
              <Box key={post.id} mb={6}>
                <Post
                  postId={post.id}
                  isMyPost={post.authorId === me?.user?.id}
                  isPostStatusVisible
                />
              </Box>
            ));
          })}
          {posts.hasNextPage && (
            <Flex justifyContent="center">
              <Button
                color="brand"
                borderColor="brand"
                variant="outline"
                size="sm"
                isLoading={posts.isFetchingNextPage}
                onClick={() => posts.fetchNextPage()}
              >
                Load more...
              </Button>
            </Flex>
          )}
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
