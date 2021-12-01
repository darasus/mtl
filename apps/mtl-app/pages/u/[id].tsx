import React from "react";
import { GetServerSideProps } from "next";
import { Post } from "../../components/Post";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useUserQuery } from "../../hooks/query/useUserQuery";
import { useRouter } from "next/router";
import { useUserPostsQuery } from "../../hooks/query/useUserPostsQuery";
import { useFollowMutation } from "../../hooks/mutation/useFollowMutation";
import { useFollowersCountQuery } from "../../hooks/query/useFollowersCountQuery";
import { useUnfollowMutation } from "../../hooks/mutation/useUnfollowMutation";
import { useDoIFollowUserQuery } from "../../hooks/query/useDoIFollowUserQuery";
import { UserGroupIcon } from "@heroicons/react/outline";
import { Layout } from "../../layouts/Layout";
import { useColors } from "../../hooks/useColors";
import { Head } from "../../components/Head";
import { Heading } from "../../components/Heading";
import { useMe } from "../../hooks/useMe";
import { getSession } from "@auth0/nextjs-auth0";

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
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={[12, 12, 3, 3]}>
            <Flex marginBottom="size-100" justifyContent="center" mb={3}>
              {user.isLoading && (
                <Flex justifyContent="center">
                  <Spinner />
                </Flex>
              )}
              {user.data && (
                <Flex flexDirection="column">
                  <Box
                    width={150}
                    height={150}
                    overflow="hidden"
                    marginBottom="size-100"
                    borderRadius="100"
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
                  <Text fontWeight="bold" fontSize="2xl" mb={1} isTruncated>
                    {user.data?.name}
                  </Text>
                  {followButton}
                  <Flex alignItems="center">
                    <Text mr={1} color={secondaryTextColor}>
                      <UserGroupIcon
                        className={secondaryTextColor}
                        width="20"
                        height="20"
                      />
                    </Text>
                    <Text
                      fontWeight="bold"
                      fontSize="sm"
                      color={secondaryTextColor}
                    >{`${followersCount.data || 0} followers`}</Text>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </GridItem>
          <GridItem colSpan={[12, 12, 9, 9]}>
            <Box>
              <Heading title="My libraries" />
              {posts.isLoading && (
                <Flex justifyContent="center">
                  <Spinner />
                </Flex>
              )}
              {posts.data?.map((post) => (
                <Box key={post.id} mb={6}>
                  <Post
                    postId={post.id}
                    isMyPost={post.authorId === me?.user?.id}
                    isPostStatusVisible
                  />
                </Box>
              ))}
            </Box>
          </GridItem>
        </Grid>
      </Layout>
    </>
  );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);

  return {
    props: {
      cookies: req.headers.cookie ?? "",
      user: session?.user || null,
    },
  };
};
