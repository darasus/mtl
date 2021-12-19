import { Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

type Props = {
  children: ReactNode;
};

export const FullscreenLayout: React.FC<Props> = (props) => {
  const mainPadding = useBreakpointValue({
    base: '4',
    mr: '0',
  });

  return (
    <>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="center"
        pl={mainPadding}
        pr={mainPadding}
      >
        <Flex flexDirection="column" width="100%" flexShrink={0}>
          <Header fullWidth />
          <Flex
            marginBottom="size-200"
            minHeight="100vh"
            flexDirection="column"
          >
            <Box height="130px" />
            <Box flexGrow="1">{props.children}</Box>
            <Box my={5}>
              <Footer />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
