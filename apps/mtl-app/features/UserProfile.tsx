import { Badge, Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useFollowMutation } from '../hooks/mutation/useFollowMutation';
import { useUnfollowMutation } from '../hooks/mutation/useUnfollowMutation';
import { useDoIFollowUserQuery } from '../hooks/query/useDoIFollowUserQuery';
import { useFollowersCountQuery } from '../hooks/query/useFollowersCountQuery';
import { useFollowingCountQuery } from '../hooks/query/useFollowingCountQuery';
import { useUserQuery } from '../hooks/query/useUserQuery';
import { useMe } from '../hooks/useMe';

interface Props {
  userProfileImageBase64?: string;
}

export const UserProfile: React.FC<Props> = ({ userProfileImageBase64 }) => {
  const router = useRouter();
  const nickname = router.query.nickname as string;
  const followersCount = useFollowersCountQuery({ nickname });
  const followingCount = useFollowingCountQuery({ nickname });
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();
  const user = useUserQuery({ nickname });
  const me = useMe();
  const doIFollowUser = useDoIFollowUserQuery({ nickname });
  const isMyPage = me?.user?.nickname === nickname;

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
        disabled={unfollowMutation.isLoading || doIFollowUser.isLoading}
        isLoading={unfollowMutation.isLoading || doIFollowUser.isLoading}
      >
        Unfollow
      </Button>
    ) : (
      <Button
        variant="outline"
        mb={1}
        onClick={handleFollow}
        disabled={followMutation.isLoading || doIFollowUser.isLoading}
        isLoading={followMutation.isLoading || doIFollowUser.isLoading}
      >
        Follow
      </Button>
    )
  ) : null;

  return (
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
  );
};
