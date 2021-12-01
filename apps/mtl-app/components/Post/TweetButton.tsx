import { Button, IconButton } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { ShareIcon } from "@heroicons/react/outline";
import React from "react";
import { Post } from "../../types/Post";

export const TweetButton = ({ post }: { post: Post }) => {
  const handleTweetClick = React.useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURI(
        `${post.title.substring(0, 279)} ${window.location.origin}/p/${post.id}`
      )}`
    );
  }, [post]);

  const commonProps = {
    "aria-label": "Tweet button",
    onClick: handleTweetClick,
  } as const;

  const mobileButton = (
    <IconButton
      {...commonProps}
      icon={<ShareIcon width="20" height="20" />}
      variant="solid"
      size="sm"
    />
  );

  const desktopButton = (
    <Button
      {...commonProps}
      leftIcon={<ShareIcon width="15" height="15" />}
      variant="ghost"
      size="xs"
    >
      <Text>Tweet</Text>
    </Button>
  );

  const buttonComponent = useBreakpointValue({
    base: mobileButton,
    sm: desktopButton,
  });

  if (!buttonComponent) return mobileButton;

  return buttonComponent;
};
