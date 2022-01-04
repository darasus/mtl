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
import { useUserTagsQuery } from '../../hooks/query/useUserTagsQuery';
import { useRecoilState } from 'recoil';
import { userTagFilterAtom } from '../../atoms/userTagFilterAtom';

interface Props {
  userProfileImageBase64: string | undefined;
}

const UserPage: React.FC<Props> = ({ userProfileImageBase64 }) => {
  const [userTagFilter, setUserTagFilter] = useRecoilState(userTagFilterAtom);
  const router = useRouter();
  const nickname = router.query.nickname as string;
  const user = useUserQuery({ nickname });
  const me = useMe();
  const posts = useUserPostsQuery({ nickname });
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();
  const followersCount = useFollowersCountQuery({ nickname });
  const followingCount = useFollowingCountQuery({ nickname });
  const doIFollowUser = useDoIFollowUserQuery({ nickname });
  const isMyPage = me?.user?.nickname === nickname;
  const userTags = useUserTagsQuery({ nickname });

  const handleFollow = () => {
    followMutation.mutateAsync({
      nickname: user.data?.nickname as string,
    });
  };

  const handleUnfollow = () => {
    unfollowMutation.mutateAsync({
      nickname: user.data?.nickname as string,
    });
  };

  const followButton = !isMyPage ? (
    doIFollowUser.data?.doIFollow ? (
      <Button
        variant="outline"
        mb={1}
        onClick={handleUnfollow}
        disabled={unfollowMutation.isLoading}
        isLoading={unfollowMutation.isLoading}
      >
        Unfollow
      </Button>
    ) : (
      <Button
        variant="outline"
        mb={1}
        onClick={handleFollow}
        disabled={followMutation.isLoading}
        isLoading={followMutation.isLoading}
      >
        Follow
      </Button>
    )
  ) : null;

  const handleTagClick = React.useCallback(
    (id) => () => {
      if (userTagFilter.includes(id)) {
        setUserTagFilter((prev) => prev.filter((tagId) => tagId !== id));
      } else {
        setUserTagFilter((prev) => [...prev, id]);
      }
    },
    [setUserTagFilter, userTagFilter]
  );

  return (
    <>
      <Head title={user.data?.name as string} urlPath={`u/${user.data?.id}`} />
      <Layout>
        <Box>
          <Flex
            flexDirection="column"
            marginBottom="size-100"
            alignItems="center"
            mb={3}
          >
            {user.isLoading && (
              <Flex justifyContent="center">
                <Spinner />
              </Flex>
            )}
            {user.data && (
              <Flex flexDirection="column" alignItems="center">
                <Box
                  width={250}
                  height={250}
                  overflow="hidden"
                  marginBottom="size-100"
                  borderRadius="full"
                  borderWidth="thick"
                  borderColor="brand"
                  boxShadow="base"
                  mb={2}
                >
                  {userProfileImageBase64 ? (
                    <Image
                      src={user?.data?.image}
                      width="500"
                      height="500"
                      alt="Avatar"
                      placeholder="blur"
                      blurDataURL={userProfileImageBase64}
                      priority={true}
                    />
                  ) : (
                    <Image
                      src={user?.data?.image}
                      width="500"
                      height="500"
                      alt="Avatar"
                      priority={true}
                    />
                  )}
                </Box>
                <Box mb={1}>
                  <Text fontWeight="bold" fontSize="2xl">
                    {user.data?.name}
                  </Text>
                </Box>
                <Flex mb={3}>
                  <Box mr={2}>
                    <Badge>{`${new Intl.NumberFormat('en-IN').format(
                      followersCount.data || 0
                    )} followers`}</Badge>
                  </Box>
                  <Box>
                    <Badge>{`${new Intl.NumberFormat('en-IN').format(
                      followingCount.data || 0
                    )} following`}</Badge>
                  </Box>
                </Flex>
                {followButton}
              </Flex>
            )}
          </Flex>
        </Box>
        <Box>
          <Heading title="My libraries" />
          {userTags.data?.length > 0 && (
            <Flex flexWrap="wrap" mb={3}>
              {userTags.data?.map((tag) => (
                <Button
                  mr={1}
                  mb={1}
                  key={tag.id}
                  borderRadius="full"
                  size="xs"
                  variant={userTagFilter.includes(tag.id) ? 'cta' : 'solid'}
                  onClick={handleTagClick(tag.id)}
                >
                  {tag.name}
                </Button>
              ))}
            </Flex>
          )}
          {(posts.isLoading || userTags.isLoading) && (
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
