import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserPreview } from './UserPreview';
import {
  Button,
  Flex,
  Box,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpoint,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {
  PlusSmIcon,
  UserIcon,
  LogoutIcon,
  CogIcon,
} from '@heroicons/react/outline';
import { Logo } from './Logo';
import { useMe } from '../hooks/useMe';
import { ActivityBadge } from '../components/ActivityBadge/ActivityBadge';

export const Header: React.FC = () => {
  const router = useRouter();
  const me = useMe();
  const breakpoint = useBreakpoint();

  return (
    <Box
      py="6"
      position="fixed"
      top={5}
      right={5}
      left={5}
      borderColor="gray.900"
      borderWidth="thin"
      borderRadius="lg"
      px={5}
      backgroundColor="black"
      zIndex="docked"
      maxW="960px"
      margin="0 auto"
    >
      <Flex alignItems="center">
        <Flex flexGrow={1}>
          <Link href="/" passHref>
            <ChakraLink display="block" fontFamily="Fira Code">
              {/* <Logo /> */}
              my tiny library
              <Text as="span" color="brand" fontFamily="Fira Code">
                {` (alpha)`}
              </Text>
            </ChakraLink>
          </Link>
        </Flex>
        {me?.isLoading && <Spinner />}
        {me?.user ? (
          <>
            {breakpoint !== 'base' && (
              <Box mr={4}>
                <Link href="/p/create" passHref>
                  <Button
                    size="xs"
                    variant="cta"
                    data-testid="create-post-button"
                  >
                    Create
                  </Button>
                </Link>
              </Box>
            )}
            <Flex alignItems="center">
              <Menu>
                <MenuButton as={UserPreview} aria-label="Options" />
                <MenuList>
                  <MenuItem
                    icon={<UserIcon width="20" height="20" />}
                    onClick={() => router.push(`/u/${me?.user?.id}`)}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    icon={<CogIcon width="20" height="20" />}
                    onClick={() => router.push(`/settings`)}
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    icon={<PlusSmIcon width="20" height="20" />}
                    onClick={() => router.push('/p/create')}
                  >
                    New post
                  </MenuItem>
                  <MenuItem
                    color="red.500"
                    icon={<LogoutIcon width="20" height="20" />}
                    onClick={() => router.push('/api/auth/logout')}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
              <Box mr={3} />
              <ActivityBadge />
            </Flex>
          </>
        ) : (
          !me?.isLoading && (
            <Flex>
              <Button
                variant="cta"
                onClick={() => router.push('/api/auth/login')}
                borderColor="brand"
                size="xs"
              >
                Sign in
              </Button>
            </Flex>
          )
        )}
      </Flex>
    </Box>
  );
};
