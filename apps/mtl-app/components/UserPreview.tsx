import { Flex, Text, Box } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import { useMe } from '../hooks/useMe';

export const UserPreview = React.forwardRef<HTMLDivElement>(
  function UserPreview({ ...props }, ref) {
    const me = useMe();

    if (!me?.user) return null;

    return (
      <div {...props}>
        <Flex ref={ref} alignItems="center" cursor="pointer">
          <Box>
            {me.user?.picture && (
              <Box
                width={6}
                height={6}
                borderRadius={100}
                overflow="hidden"
                boxShadow="base"
              >
                <Image
                  src={me.user?.picture as string}
                  width="100"
                  height="100"
                  alt="Avatar"
                  quality={100}
                />
              </Box>
            )}
          </Box>
        </Flex>
      </div>
    );
  }
);
