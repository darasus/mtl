import { Heading as ChakraHeading, Flex, Box } from "@chakra-ui/layout";
import React from "react";

interface Props {
  title: string;
}

export const Heading: React.FC<Props> = ({ title, children }) => {
  return (
    <Box
      mb={10}
      variant="section-heading"
      borderColor="brand"
      borderBottomWidth="medium"
      paddingBottom="0px"
    >
      <Flex alignItems="center">
        <Box mr={4}>
          <ChakraHeading lineHeight={1}>{title}</ChakraHeading>
        </Box>
        <Flex alignItems="center">{children}</Flex>
      </Flex>
    </Box>
  );
};
