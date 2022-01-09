import { Box } from '@chakra-ui/react';
import React from 'react';
import { Layout } from '../layouts/Layout';
import { Head } from '../components/Head';
import { Intro } from '../components/Intro';
import { useMe } from '../hooks/useMe';
import { useRouter } from 'next/router';

const Index: React.FC = () => {
  const router = useRouter();
  const me = useMe();
  const isMeLoading = me?.isLoading;

  React.useEffect(() => {
    if (me?.user?.nickname) {
      router.push(`/u/${me?.user?.nickname}`);
    }
  }, [me?.user?.nickname, router]);

  if (me?.user?.id) return null;

  return (
    <>
      <Head title="Home" urlPath="" />
      <Layout>
        {!isMeLoading && (
          <Box height="100%">
            <Intro withSignIn />
          </Box>
        )}
      </Layout>
    </>
  );
};

export { getServerSideProps } from '../components/MTLProvider';

export default Index;
