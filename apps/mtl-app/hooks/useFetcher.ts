import React from 'react';
import { ClientHttpConnector } from '../lib/ClientHttpConnector';
import { Fetcher } from '../lib/Fetcher';
import { useAccessToken } from '../pages/_app';

export const useFetcher = () => {
  const accessToken = useAccessToken();
  const httpConnector = React.useMemo(
    () =>
      new ClientHttpConnector({
        accessToken,
      }),
    [accessToken]
  );
  return React.useMemo(() => new Fetcher(httpConnector), [httpConnector]);
};
