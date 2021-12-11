import { getSession } from '@auth0/nextjs-auth0';
import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
} from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';
import { theme } from '../theme';
import React from 'react';
import { GetServerSideProps } from 'next';

const AccessTokenContext = React.createContext<string | null>(null);

export const useAccessToken = () => {
  const accessToken = React.useContext(AccessTokenContext);

  return accessToken;
};

interface Props {
  cookies: string | undefined;
  accessToken: string | undefined;
}

export const MTLProvider: React.FC<Props> = ({
  cookies,
  children,
  accessToken,
}) => {
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManager(cookies)
      : localStorageManager;

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            borderRadius: '100px',
            borderColor:
              colorModeManager.get() === 'dark'
                ? 'rgba(0,0,0,0.2)'
                : 'rgba(255,255,255,0.2)',
            borderWidth: '1px',
            ...(colorModeManager.get() === 'dark'
              ? { background: 'white', color: '#black' }
              : { background: 'black', color: '#fff' }),
          },
        }}
      />
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        <AccessTokenContext.Provider value={accessToken}>
          {children}
        </AccessTokenContext.Provider>
      </ChakraProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);

  return {
    props: {
      accessToken: session?.accessToken,
      cookies: req?.headers?.cookie ?? '',
      user: session?.user || undefined,
    },
  };
};
