import Prisma from ".prisma/client";
import { Flex, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { RouterLink } from "./RouterLinkt";

interface Props {
  user: Omit<Prisma.User, "password">;
}

export const PostUserPreview: React.FC<Props> = ({ user }) => {
  return (
    <Flex alignItems="center">
      <Box
        width={7}
        height={7}
        borderRadius={100}
        overflow="hidden"
        boxShadow="base"
        mr={1}
      >
        <RouterLink href={`/u/${user?.id}`}>
          <Image
            src={user?.image as string}
            width="100"
            height="100"
            alt="Avatar"
          />
        </RouterLink>
      </Box>
      <RouterLink href={`/u/${user?.id}`}>
        <Text whiteSpace="nowrap" fontSize="sm">
          {user?.name}
        </Text>
      </RouterLink>
    </Flex>
  );
};
