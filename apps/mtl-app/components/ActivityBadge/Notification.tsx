import { Activity } from ".prisma/client";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { MenuItem } from "@chakra-ui/menu";
import {
  ChatAltIcon,
  ThumbUpIcon,
  UserAddIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React from "react";
import { useMarkActivityAsReadMutation } from "../../hooks/mutation/useMarkActivityAsReadMutation";

export const Notification = ({ activity }: { activity: Activity & any }) => {
  const router = useRouter();
  const markAsReadMutation = useMarkActivityAsReadMutation(activity.id);
  const isLikeNotification = typeof activity.likeId === "number";
  const isCommentNotification = typeof activity.commentId === "number";
  const isFollowNotification =
    typeof activity?.follow?.follower?.id === "number";

  const composeActivityMessage = React.useCallback(
    (activity: Activity & any) => {
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
            <Text as="span">{activity?.follow?.follower?.name}</Text>
            <Text as="span" color="gray.500">{` followed you`}</Text>
          </>
        );
      }

      return null;
    },
    [isLikeNotification, isCommentNotification, isFollowNotification]
  );

  const message = composeActivityMessage(activity);

  const onClick = React.useCallback(() => {
    markAsReadMutation.mutate();
    if (isLikeNotification || isCommentNotification) {
      router.push(`/p/${activity.postId}`);
    }
    if (isFollowNotification) {
      router.push(`/u/${activity?.follow?.follower?.id}`);
    }
  }, [
    markAsReadMutation,
    router,
    activity.postId,
    activity?.follow,
    isLikeNotification,
    isCommentNotification,
    isFollowNotification,
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
          {activity.unread && (
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
