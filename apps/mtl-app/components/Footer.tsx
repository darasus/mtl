import { Flex, Link, Text } from "@chakra-ui/layout";
import React from "react";
import { useColors } from "../hooks/useColors";

export const Footer = () => {
  const { secondaryTextColor } = useColors();

  return (
    <Flex justifyContent="center">
      <Text as="span" color={secondaryTextColor} fontSize="sm">
        {`${new Date().getFullYear()} © All rights reserved. Twitter `}
        <Link
          href="https://twitter.com/mytinylibrary"
          target="_blank"
        >{`@MyTinyLibrary`}</Link>
      </Text>
    </Flex>
  );
};
