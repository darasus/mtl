import App, { AppProps } from 'next/app';
import { PusherProvider } from '@harelpls/use-pusher';
import Head from 'next/head';
import React from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import { toast } from 'react-hot-toast';
import * as Fathom from 'fathom-client';
import { useRouter } from 'next/router';
import { UserProvider } from '@auth0/nextjs-auth0';
import { MTLProvider } from '../components/MTLProvider';

const MyApp = ({
  Component,
  pageProps,
  accessToken,
}: AppProps & { accessToken: string }) => {
  const router = useRouter();
  const queryClientRef = React.useRef<QueryClient>();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      queryCache: new QueryCache({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any, query) => {
          if (query.state.data !== undefined) {
            toast.error(`Something went wrong: ${error.message}`);
          }
        },
      }),
    });
  }

  React.useEffect(() => {
    Fathom.load('STOSBNAU', {
      includedDomains: ['www.mytinylibrary.com'],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <MTLProvider
          cookies={pageProps.cookie}
          accessToken={pageProps.accessToken}
        >
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
          </Head>
          <UserProvider {...pageProps}>
            <PusherProvider
              clientKey={process.env.NEXT_PUBLIC_PUSHER_APP_KEY}
              cluster="eu"
            >
              <Component {...pageProps} />
            </PusherProvider>
          </UserProvider>
        </MTLProvider>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default MyApp;
