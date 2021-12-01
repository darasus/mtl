import React from "react";
import { GetServerSideProps } from "next";
import { Post } from "../../../components/Post";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { useRouter } from "next/router";
import { Layout } from "../../../layouts/Layout";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { Flex, Spinner } from "@chakra-ui/react";
import { Head } from "../../../components/Head";
import { createIsFirstServerCall } from "../../../utils/createIsFirstServerCall";
import { Fetcher } from "../../../lib/Fetcher";
import { ServerHttpConnector } from "../../../lib/ServerHttpConnector";
import { useMe } from "../../../hooks/useMe";
import { clientCacheKey } from "../../../lib/ClientCacheKey";
import { getSession } from "@auth0/nextjs-auth0";

const PostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(router.query.id as string);
  const me = useMe();
  const imageUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/screenshot?url=${
    process.env.NEXT_PUBLIC_VERCEL_URL
  }/p/${router.query.id}/thumbnail?colorMode=dark&updateDate=${new Date(
    post.data?.updatedAt as Date
  ).getTime()}`;

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
        cookies: ctx.req.headers.cookie ?? "",
      },
    };
  }

  const httpConnector = new ServerHttpConnector(ctx);
  const fetcher = new Fetcher(httpConnector);
  const postId = ctx.query.id as string;

  try {
    const post = await fetcher.getPost(postId);

    await Promise.all([
      queryClient.prefetchQuery(clientCacheKey.createPostKey(postId), () =>
        Promise.resolve(post)
      ),
      queryClient.prefetchQuery(
        clientCacheKey.createPostCommentsKey(post.id),
        () =>
          Promise.resolve({
            items: post.comments,
            total: post.commentsCount,
            count: post.comments.length,
          })
      ),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
      user: session?.user || null,
    },
  };
};
