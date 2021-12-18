import { GetServerSideProps } from 'next';
import { Post } from '../components/Post';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import React from 'react';
import { useFeedQuery } from '../hooks/query/useFeedQuery';
import { Layout } from '../layouts/Layout';
import { Head } from '../components/Head';
import { Intro } from '../components/Intro';
import { FeedType } from '../types/FeedType';
import { Heading } from '../components/Heading';
import { useMe } from '../hooks/useMe';
import { getSession } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

const Index: React.FC = () => {
  const router = useRouter();
  // const [feedType, setFeedType] = React.useState(FeedType.Latest);
  // const feed = useFeedQuery({ feedType });
  const me = useMe();
  const isMeLoading = me?.isLoading;

  React.useEffect(() => {
    if (me?.user?.id) {
      router.push(`/u/${me?.user?.id}`);
    }
  }, [me?.user?.id, router]);

  if (me?.user?.id) return null;

  return (
    <>
      <Head title="Home" urlPath="" />
      <Layout>
        {!isMeLoading && (
          <Box mt={10} mb={20}>
            <Center>
              <Intro withSignIn />
            </Center>
          </Box>
        )}
        {/* <Heading title="Library feed">
            <ButtonGroup isAttached variant="solid">
              <Button
                size="xs"
                variant={feedType === FeedType.Latest ? 'cta' : 'solid'}
                onClick={() => setFeedType(FeedType.Latest)}
                mr="0px"
              >
                Latest
              </Button>
              <Button
                size="xs"
                variant={feedType === FeedType.Following ? 'cta' : 'solid'}
                onClick={() => setFeedType(FeedType.Following)}
              >
                Following
              </Button>
            </ButtonGroup>
          </Heading>
          {feed.isLoading && (
            <Flex justifyContent="center" mt={5} mb={5}>
              <Spinner />
            </Flex>
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
          )} */}
      </Layout>
    </>
  );
};

export { getServerSideProps } from '../components/MTLProvider';

export default Index;
