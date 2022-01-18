import React from 'react';
import { GetServerSideProps } from 'next';
import { Post } from '../../../components/Post';
import { usePostQuery } from '../../../hooks/query/usePostQuery';
import { useRouter } from 'next/router';
import { Layout } from '../../../layouts/Layout';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { Flex, Spinner } from '@chakra-ui/react';
import { Head } from '../../../components/Head';
import { Fetcher } from '../../../lib/Fetcher';
import { useMe } from '../../../hooks/useMe';
import { getSession } from '@auth0/nextjs-auth0';
import getConfig from 'next/config';
import { HttpConnector } from '../../../lib/HttpConnector';
import { createIsFirstServerCall } from '@mtl/utils';
import { clientCacheKey } from '@mtl/cache';

const PostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery({ postId: router.query.id as string });
  const me = useMe();
  const imageUrl = `${
    getConfig().publicRuntimeConfig.SCREENSHOT_API_BASE_URL
  }/api/thumbnail?id=${router.query.id}`;

  return (
    <>
      <Head
        title={post.data?.title as string}
        description={post.data?.description as string}
        urlPath={`p/${post.data?.id}`}
        facebookImage={imageUrl}
        twitterImage={imageUrl}
      />
      <Layout>
        <main>
          {post.isLoading && (
            <Flex justifyContent="center" mt={5} mb={5}>
              <Spinner />
            </Flex>
          )}
          {post.data && (
            <Post
              postId={post.data.id}
              isMyPost={post.data.authorId === me?.user?.id}
              isPostLoading={post.isFetching}
              isPostStatusVisible={true}
            />
          )}
        </main>
      </Layout>
    </>
  );
};

export default PostPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const session = await getSession(ctx.req, ctx.res);

  if (!createIsFirstServerCall(ctx)) {
    return {
      props: {
        accessToken: session?.accessToken || null,
        cookies: ctx.req?.headers?.cookie ?? '',
        user: session?.user || undefined,
      },
    };
  }

  // const httpConnector = new HttpConnector();
  // const fetcher = new Fetcher(httpConnector);
  // const postId = ctx.query.id as string;

  // try {
  //   const post = await fetcher.getPost({ postId });

  //   await Promise.all([
  //     queryClient.prefetchQuery(clientCacheKey.createPostKey({ postId }), () =>
  //       Promise.resolve(post)
  //     ),
  //     queryClient.prefetchQuery(
  //       clientCacheKey.createPostCommentsKey({ postId: post.id }),
  //       () =>
  //         Promise.resolve({
  //           items: post.comments,
  //           total: post.commentsCount,
  //           count: post.comments.length,
  //         })
  //     ),
  //   ]);
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // } catch (e: any) {
  //   if (e?.response?.status === 404) {
  //     return {
  //       notFound: true,
  //     };
  //   }
  // }

  // return {
  //   props: {
  //     dehydratedState: dehydrate(queryClient),
  //     accessToken: session?.accessToken || null,
  //     cookies: ctx.req?.headers?.cookie ?? '',
  //     user: session?.user || null,
  //   },
  // };
};
