import { Button, IconButton, IconButtonProps } from "@chakra-ui/button";
import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import { BellIcon } from "@heroicons/react/outline";
import { useUserActivityQuery } from "../../hooks/query/useUserActivityQuery";
import { useMe } from "../../hooks/useMe";
import React from "react";
import { useChannel, useEvent } from "@harelpls/use-pusher";
import { Flex, Text } from "@chakra-ui/layout";
import { Notification } from "./Notification";
import { useLocalStorage } from "react-use";
import { useMarkAllActivityAsReadMutation } from "../../hooks/mutation/useMarkAllActivityAsReadMutation";

export const ActivityBadge = () => {
  const me = useMe();
  const mutation = useMarkAllActivityAsReadMutation();
  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserActivityQuery(me?.user?.id as string);
  const [showUnread, setShowUnread] = React.useState(false);
  const [lastReadDate, setLastReadDate] =
    useLocalStorage<Date>("last_unread_date");
  const channel = useChannel(`activity-user-${me?.user?.id}`);

  const handleMarkAllAsRead = React.useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  const fisrtItem = React.useMemo(
    () => data?.pages?.[0].items?.[0],
    [data?.pages]
  );

  React.useEffect(() => {
    if (fisrtItem?.createdAt) {
      if (!lastReadDate) {
        setLastReadDate(fisrtItem.createdAt);
      }
      if (lastReadDate) {
        setShowUnread(
          new Date(fisrtItem.createdAt).getTime() >
            new Date(lastReadDate).getTime()
        );
      }
    }
  }, [data, lastReadDate, setLastReadDate, fisrtItem]);

  useEvent(channel, "activity-added", () => {
    refetch();
  });

  useEvent(channel, "activity-removed", () => {
    refetch();
  });

  const Icon = React.useMemo(() => {
    return React.forwardRef<HTMLButtonElement, IconButtonProps>(function Ucon(
      props,
      ref
    ) {
      return (
        <IconButton
          ref={ref}
          {...props}
          size="xs"
          aria-label="activity button"
          variant={showUnread ? "red" : "solid"}
        />
      );
    });
  }, [showUnread]);

  const hasNotification =
    data?.pages?.[0]?.items && data?.pages?.[0]?.items.length > 0;

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Icon}
            variant="solid"
            borderRadius="full"
            icon={<BellIcon width="14px" height="14px" />}
            onClick={() => {
              setLastReadDate(fisrtItem?.createdAt);
            }}
          />
          <MenuList maxWidth="300px" maxHeight="500" overflowY="auto">
            {hasNotification && (
              <Flex px={3} justifyContent="end" mb={1}>
                <Button
                  size="xs"
                  color="gray.500"
                  textDecoration="underline"
                  variant="link"
                  onClick={handleMarkAllAsRead}
                  isLoading={mutation.isLoading}
                >
                  Mark all as read
                </Button>
              </Flex>
            )}
            {!hasNotification && (
              <Flex justifyContent="center">
                <Text fontSize="sm" color="gray.500">
                  No notifications yet...
                </Text>
              </Flex>
            )}
            {data?.pages?.map((page) =>
              page.items?.map((activity) => (
                <Notification key={activity.id} activity={activity} />
              ))
            )}
            {hasNextPage && (
              <Flex justifyContent="center" my={1}>
                <Button
                  isLoading={isFetchingNextPage}
                  size="xs"
                  onClick={() => fetchNextPage()}
                >
                  Load more...
                </Button>
              </Flex>
            )}
          </MenuList>
        </>
      )}
    </Menu>
  );
};
