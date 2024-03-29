import { Button, Text, useBreakpointValue, IconButton } from '@chakra-ui/react';
import { PhotographIcon } from '@heroicons/react/outline';
import { paramCase } from 'change-case';
import React from 'react';
import download from 'js-file-download';
import { useScreenshotQuery } from '../../hooks/query/useScreenshotQuery';
import { TPost } from '@mtl/types';

interface Props {
  post: TPost;
}

export const ScreenshotButton: React.FC<Props> = ({ post }) => {
  const { refetch, isFetching } = useScreenshotQuery({
    postId: post.id,
    updateDate: post.updatedAt,
  });

  const handleClick = React.useCallback(async () => {
    const screenshot = await refetch();
    download(
      screenshot.data as Blob,
      `${paramCase(post.title)}.png`,
      'image/png'
    );
  }, [refetch, post]);

  const commonProps = {
    'aria-label': 'Make screenshot button',
    as: 'a',
    onClick: handleClick,
    cursor: 'pointer',
    isLoading: isFetching,
  } as const;

  const mobileButton = (
    <IconButton
      {...commonProps}
      icon={<PhotographIcon width="20" height="20" />}
      variant="solid"
      size="sm"
    />
  );

  const desktopButton = (
    <Button
      {...commonProps}
      leftIcon={<PhotographIcon width="15" height="15" />}
      variant="ghost"
      size="xs"
      loadingText={'Screenshot'}
    >
      <Text>Screenshot</Text>
    </Button>
  );

  const buttonComponent = useBreakpointValue(
    {
      base: mobileButton,
      sm: desktopButton,
    },
    'sm'
  );

  if (!buttonComponent) return mobileButton;

  return buttonComponent;
};
