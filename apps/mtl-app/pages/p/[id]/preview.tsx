import React from 'react';
import { Post } from '../../../components/Post';
import { usePostQuery } from '../../../hooks/query/usePostQuery';
import { useRouter } from 'next/router';
import { PreviewLayout } from '../../../layouts/PreviewLayout';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Logo } from '../../../components/Logo';
import { useMe } from '../../../hooks/useMe';
import { GetServerSideProps } from 'next';

const PreviewPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery({ postId: router.query.id as string });
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
            <Box>
              <Text as="span" fontFamily="Fira Code">
                Created with
              </Text>
              <Text as="span" fontFamily="Fira Code">
                {' '}
              </Text>
              <Text as="span" fontFamily="Fira Code" color="brand">
                my tiny libraty
              </Text>
            </Box>
          </Flex>
        </Box>
      </main>
    </PreviewLayout>
  );
};

export { getServerSideProps } from '../../../components/MTLProvider';

export default PreviewPage;
