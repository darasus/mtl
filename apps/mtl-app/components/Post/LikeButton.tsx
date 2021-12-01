import { Button, Text, IconButton, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { usePostLikeMutation } from "../../hooks/mutation/usePostLikeMutation";
import { Post } from "../../types/Post";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { usePostUnlikeMutation } from "../../hooks/mutation/usePostUnlikeMutation";

interface Props {
  post: Post;
  isPostLoading?: boolean;
}

export const LikeButton: React.FC<Props> = ({ post, isPostLoading }) => {
  const { mutate: likePost, isLoading: likeIsLoading } = usePostLikeMutation();
  const { mutate: unlikePost, isLoading: unlikeIsLoading } =
    usePostUnlikeMutation();
  const handleLikeClick = React.useCallback(
    () => likePost({ postId: post.id }),
    [post.id, likePost]
  );
  const handleUnlikeClick = React.useCallback(
    () => unlikePost({ postId: post.id }),
    [post.id, unlikePost]
  );
  const text = `${post.isLikedByMe ? "Unlike" : "Like"}`;

  const commonProps = {
    onClick: post.isLikedByMe ? handleUnlikeClick : handleLikeClick,
    disabled: likeIsLoading || unlikeIsLoading || isPostLoading,
    isLoading: likeIsLoading || unlikeIsLoading,
    "aria-label": "Like button",
  } as const;

  const mobileButton = (
    <IconButton
      {...commonProps}
      icon={
        post.isLikedByMe ? (
          <ThumbDownIcon width="20" height="20" />
        ) : (
          <ThumbUpIcon width="20" height="20" />
        )
      }
      size="sm"
      variant="solid"
    />
  );

  const desktopButton = (
    <Button
      {...commonProps}
      leftIcon={<ThumbUpIcon width="15" height="15" />}
      size="xs"
      variant="ghost"
      loadingText={post.isLikedByMe ? "Liking" : "Unliking"}
    >
      <Text>{text}</Text>
    </Button>
  );

  const buttonComponent = useBreakpointValue({
    base: mobileButton,
    sm: desktopButton,
  });

  if (!buttonComponent) return mobileButton;

  return buttonComponent;
};
