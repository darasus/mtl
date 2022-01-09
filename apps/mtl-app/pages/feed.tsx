import { Post } from '../components/Post';
import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import { useFeedQuery } from '../hooks/query/useFeedQuery';
import { Layout } from '../layouts/Layout';
import { Head } from '../components/Head';
import { Heading } from '../components/Heading';
import { useMe } from '../hooks/useMe';
import { FeedType } from '@mtl/types';

const Feed: React.FC = () => {
  const [feedType, setFeedType] = React.useState(FeedType.Following);
  const feed = useFeedQuery({ feedType });
  const me = useMe();

  return (
    <>
      <Head title="Home" urlPath="" />
      <Layout>
        <Heading title="Library feed" />
        {feed.isLoading && (
          <Flex justifyContent="center" mt={5} mb={5}>
            <Spinner />
          </Flex>
        )}
        {!feed.isLoading && feed.data?.pages?.[0].items.length === 0 && (
          <Box textAlign="center">
            <Text fontSize="sm">{`You're not following anyone yet...`}</Text>
          </Box>
        )}
        {feed.data?.pages?.map((page) => {
          return page.items?.map((post) => {
            return (
              <Box key={post.id} mb={6}>
                <Post
                  postId={post.id}
                  isMyPost={post.authorId === me?.user?.id}
                />
              </Box>
            );
          });
        })}
        {feed.hasNextPage && (
          <Flex justifyContent="center">
            <Button
              color="brand"
              borderColor="brand"
              variant="outline"
              size="sm"
              isLoading={feed.isFetchingNextPage}
              onClick={() => feed.fetchNextPage()}
            >
              Load more...
            </Button>
          </Flex>
        )}
      </Layout>
    </>
  );
};

export { getServerSideProps } from '../components/MTLProvider';

export default Feed;
