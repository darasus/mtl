import { Box, Flex, Text } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import React from "react";
import { RouterLink } from "./RouterLinkt";

interface Props {
  withSignIn?: boolean;
}

export const Intro: React.FC<Props> = ({ withSignIn }) => {
  const textSize = useBreakpointValue({
    base: "lg",
    sm: "5xl",
  });

  return (
    <Flex direction="column">
      <Box fontFamily="Fira Code" fontSize={textSize}>
        <Text as="span" color="yellow.300">
          {"=>"}
        </Text>
        <Text as="span" color="gray.600" fontWeight="light">
          this is
        </Text>
        <Text as="span" color="yellow.300">
          {"==="}
        </Text>
        <Text as="span" color="yellow.300">
          {"{"}
        </Text>
        <Text as="span" fontWeight="bold">
          my tiny library
        </Text>
        <Text as="span" color="yellow.300">
          {"}"}
        </Text>
        <Text as="span" fontWeight="light" color="gray.600">
          the best way
        </Text>
        <Text as="span" color="yellow.300">
          {">>="}
        </Text>
        <Text as="span" fontWeight="light" color="gray.600">
          to share tiny libraries
        </Text>
        <Text as="span" color="yellow.300">
          {"<~>"}
        </Text>
        <Text as="span" fontWeight="light" color="gray.600">
          with your peers
        </Text>
        {withSignIn && (
          <>
            <Text as="span" color="yellow.300">
              {"!=="}
            </Text>
            <RouterLink
              href="/api/auth/login"
              chakraLinkProps={{
                color: "brand",
                fontWeight: "bold",
                "data-testid": "intro-signin-button",
              }}
            >
              Join now
            </RouterLink>
          </>
        )}
      </Box>
    </Flex>
  );
};
