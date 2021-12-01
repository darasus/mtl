import React from "react";
import { Post } from "../../../components/Post";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { useRouter } from "next/router";
import { PreviewLayout } from "../../../layouts/PreviewLayout";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Logo } from "../../../components/Logo";
import { useMe } from "../../../hooks/useMe";
import { GetServerSideProps } from "next";

const PreviewPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(router.query.id as string);
  const me = useMe();

  if (!post.data) return null;

  return (
    <PreviewLayout>
      <main>
        <Post
          postId={post.data.id}
          isMyPost={post.data.authorId === me?.user?.id}
          showActionMenu={false}
          showMetaInfo={false}
        />
        <Box mt={5}>
          <Flex alignItems="center" justifyContent="center">
            <Box mr={1.5}>
              <Text>Created with</Text>
            </Box>
            <Box style={{ marginBottom: -9 }}>
              <Logo />
            </Box>
          </Flex>
        </Box>
      </main>
    </PreviewLayout>
  );
};

export default PreviewPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
};
