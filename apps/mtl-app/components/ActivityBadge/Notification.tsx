import { Box, Flex, Text } from '@chakra-ui/layout';
import { MenuItem } from '@chakra-ui/menu';
import {
  ChatAltIcon,
  ThumbUpIcon,
  UserAddIcon,
} from '@heroicons/react/outline';
import { TActivity } from '@mtl/types';
import { useRouter } from 'next/router';
import React from 'react';
import { useMarkActivityAsReadMutation } from '../../hooks/mutation/useMarkActivityAsReadMutation';

export const Notification = ({ activity }: { activity: TActivity }) => {
  const router = useRouter();
  const markAsReadMutation = useMarkActivityAsReadMutation({
    activityId: activity.id,
  });
  const isLikeNotification = activity.type === 'LIKE';
  const isCommentNotification = activity.type === 'COMMENT';
  const isFollowNotification = activity.type === 'FOLLOW';

  const composeActivityMessage = React.useCallback(
    (activity: TActivity) => {
      if (isLikeNotification) {
        return (
          <>
            <Text as="span">{activity.author.name}</Text>
            <Text as="span" color="gray.500">{` liked your post `}</Text>
            <Text as="span">{activity.post.title}</Text>
          </>
        );
      }

      if (isCommentNotification) {
        return (
          <>
            <Text as="span">{activity.author.name}</Text>
            <Text as="span" color="gray.500">{` commented on your post `}</Text>
            <Text as="span">{activity.post.title}</Text>
          </>
        );
      }

      if (isFollowNotification) {
        return (
          <>
            <Text as="span">{activity.author.name}</Text>
            <Text as="span" color="gray.500">{` followed you`}</Text>
          </>
        );
      }

      return null;
    },
    [isLikeNotification, isCommentNotification, isFollowNotification]
  );

  const message = composeActivityMessage(activity);

  const onClick = React.useCallback(async () => {
    markAsReadMutation.mutate();
    if (isLikeNotification || isCommentNotification) {
      router.push(`/p/${activity.postId}`);
    }
    if (isFollowNotification) {
      router.push(`/u/${activity.author.id}`);
    }
  }, [
    markAsReadMutation,
    router,
    isLikeNotification,
    isCommentNotification,
    isFollowNotification,
    activity.author.id,
    activity.postId,
  ]);

  return (
    <MenuItem onClick={onClick} key={activity.id}>
      <Flex alignItems="start" width="100%">
        <Box mt="5px" mr={1} height="100%">
          {isLikeNotification && <ThumbUpIcon width="15px" height="15px" />}
          {isCommentNotification && <ChatAltIcon width="15px" height="15px" />}
          {isFollowNotification && <UserAddIcon width="15px" height="15px" />}
        </Box>
        <Box flexGrow={1} maxWidth="100%" overflow="hidden">
          <Text noOfLines={2} size="sm">
            {message}
          </Text>
        </Box>
        <Flex alignItems="center" ml={2} minWidth={3}>
          {!activity.read && (
            <Box
              mt="7px"
              width={2}
              height={2}
              borderRadius="full"
              bg="blue.500"
            />
          )}
        </Flex>
      </Flex>
    </MenuItem>
  );
};
