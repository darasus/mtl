import { Box } from '@chakra-ui/react';
import React from 'react';
import { Head } from '../components/Head';
import { Intro } from '../components/Intro';
import { useMe } from '../hooks/useMe';
import { useRouter } from 'next/router';
import { HomeLayout } from '../layouts/HomeLayout';

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
      <HomeLayout>
        {!isMeLoading && (
          <Box height="100%">
            <Intro withSignIn />
          </Box>
        )}
      </HomeLayout>
    </>
  );
};

export { getServerSideProps } from '../components/MTLProvider';

export default Index;
