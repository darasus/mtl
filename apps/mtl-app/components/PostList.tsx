import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { TPost } from '@mtl/types';
import React from 'react';
import { useMe } from '../hooks/useMe';
import { Post } from './Post';

interface Props {
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  posts: TPost[];
  fetchNextPage?: () => void;
}

export const PostList = ({
  isLoading,
  posts,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Props) => {
  // TODO: remove this dependency
  const me = useMe();

  return (
    <>
      {isLoading && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {posts.map((post) => {
        return (
          <Box key={post.id} mb={6}>
            <Post postId={post.id} isPostStatusVisible />
          </Box>
        );
      })}
      {hasNextPage && (
        <Flex justifyContent="center">
          <Button
            color="brand"
            borderColor="brand"
            variant="outline"
            size="sm"
            isLoading={isFetchingNextPage}
            onClick={fetchNextPage}
          >
            Load more...
          </Button>
        </Flex>
      )}
    </>
  );
};
