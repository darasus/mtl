import { Center } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import React from 'react';
import { Intro } from '../components/Intro';

const HomePreviewImage: React.FC = () => {
  return (
    <Center height="100vh">
      <Intro />
    </Center>
  );
};

export { getServerSideProps } from '../components/MTLProvider';

export default HomePreviewImage;
