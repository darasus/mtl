import { Flex, Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const ThumbnailLayout: React.FC<Props> = (props) => (
  <>
    <Flex
      width="1200px"
      minHeight="630px"
      justifyContent="center"
      alignItems="center"
    >
      <Flex flexDirection="column" width="100%" flexShrink={0} p={5}>
        <Box>{props.children}</Box>
      </Flex>
    </Flex>
  </>
);
