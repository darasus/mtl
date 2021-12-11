import React from 'react';
import { useAccessToken } from '../components/MTLProvider';
import { ClientHttpConnector } from '../lib/ClientHttpConnector';
import { Fetcher } from '../lib/Fetcher';

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
