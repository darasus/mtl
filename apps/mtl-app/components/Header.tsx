import React from 'react';
import { useRouter } from 'next/router';
import { UserPreview } from './UserPreview';
import {
  Button,
  Flex,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpoint,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import {
  PlusSmIcon,
  UserIcon,
  LogoutIcon,
  CogIcon,
  RssIcon,
} from '@heroicons/react/outline';
import { useMe } from '../hooks/useMe';
import { ActivityBadge } from '../components/ActivityBadge/ActivityBadge';
import { Link } from './Link';
import { useColors } from '../hooks/useColors';

interface Props {
  fullWidth?: boolean;
}

export const Header: React.FC<Props> = ({ fullWidth }) => {
  const router = useRouter();
  const me = useMe();
  const breakpoint = useBreakpoint();
  const logo = useBreakpointValue(
    {
      base: 'mtl',
      md: 'my tiny library',
    },
    'md'
  );
  const colorMode = useColorMode();
  const colors = useColors();

  return (
    <Box
      py="6"
      position="fixed"
      top={4}
      right={4}
      left={4}
      borderColor={colors.borderColor}
      borderWidth="thin"
      px={5}
      backgroundColor={colorMode.colorMode === 'dark' ? 'black' : 'white'}
      zIndex="docked"
      maxW={fullWidth ? undefined : '960px'}
      margin="0 auto"
    >
      <Flex alignItems="center">
        <Box>
          <Link
            href={me?.user?.nickname ? `/u/${me?.user?.nickname}` : '/'}
            fontFamily="Fira Code"
          >
            {logo}
            <Text as="span" color="brand" fontFamily="Fira Code">
              {` (alpha)`}
            </Text>
          </Link>
        </Box>
        <Box flexGrow={1} />
        {me?.isLoading && <Spinner />}
        {me?.user ? (
          <>
            {breakpoint !== 'base' && (
              <Box mr={4}>
                <Button
                  variant="cta"
                  size="xs"
                  data-testid="create-post-button"
                  onClick={() => router.push('/p/create')}
                >
                  Create
                </Button>
              </Box>
            )}
            <Flex alignItems="center">
              <Menu>
                <MenuButton as={UserPreview} aria-label="Options" />
                <MenuList>
                  <MenuItem
                    icon={<RssIcon width="20" height="20" />}
                    onClick={() => router.push(`/feed`)}
                  >
                    Feed
                  </MenuItem>
                  <MenuItem
                    icon={<UserIcon width="20" height="20" />}
                    onClick={() => router.push(`/u/${me?.user?.nickname}`)}
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
                Login
              </Button>
            </Flex>
          )
        )}
      </Flex>
    </Box>
  );
};
