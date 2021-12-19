import React from 'react';
import { Post } from '../../components/Post';
import { Badge, Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useUserQuery } from '../../hooks/query/useUserQuery';
import { useRouter } from 'next/router';
import { useUserPostsQuery } from '../../hooks/query/useUserPostsQuery';
import { useFollowMutation } from '../../hooks/mutation/useFollowMutation';
import { useFollowersCountQuery } from '../../hooks/query/useFollowersCountQuery';
import { useUnfollowMutation } from '../../hooks/mutation/useUnfollowMutation';
import { useDoIFollowUserQuery } from '../../hooks/query/useDoIFollowUserQuery';
import { Layout } from '../../layouts/Layout';
import { useColors } from '../../hooks/useColors';
import { Head } from '../../components/Head';
import { Heading } from '../../components/Heading';
import { useMe } from '../../hooks/useMe';

const UserPage: React.FC = () => {
  const { secondaryTextColor } = useColors();
  const router = useRouter();
  const userId = router.query.id as string;
  const user = useUserQuery(userId);
  const me = useMe();
  const posts = useUserPostsQuery(userId);
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();
  const followersCount = useFollowersCountQuery(userId);
  const doIFollowUser = useDoIFollowUserQuery(userId);
  const isMyPage = me?.user?.id === userId;

  const handleFollow = () => {
    followMutation.mutateAsync({
      userId: user.data?.id as string,
    });
  };

  const handleUnfollow = () => {
    unfollowMutation.mutateAsync({
      userId: user.data?.id as string,
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
                  <Image
                    src={user.data?.image as string}
                    width="500"
                    height="500"
                    alt="Avatar"
                  />
                </Box>
                <Box mb={1}>
                  <Text fontWeight="bold" fontSize="2xl">
                    {user.data?.name}
                  </Text>
                </Box>
                <Box mb={3}>
                  <Box>
                    <Badge>{`${new Intl.NumberFormat('en-IN').format(
                      followersCount.data || 0
                    )} followers`}</Badge>
                  </Box>
                </Box>
                {followButton}
              </Flex>
            )}
          </Flex>
        </Box>
        <Box>
          <Heading title="My libraries" />
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

export { getServerSideProps } from '../../components/MTLProvider';

export default UserPage;
