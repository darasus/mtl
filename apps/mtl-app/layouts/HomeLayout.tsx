import { Flex, Box, Center } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

type Props = {
  children: ReactNode;
};

export const HomeLayout: React.FC<Props> = (props) => {
  return (
    <>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="center"
        pl={4}
        pr={4}
      >
        <Flex flexDirection="column" width="100%" maxWidth={960} flexShrink={0}>
          <Center minHeight="100vh" flexDirection="column">
            <Center flexGrow="1">{props.children}</Center>
            <Box my={5}>
              <Footer />
            </Box>
          </Center>
        </Flex>
      </Flex>
    </>
  );
};
