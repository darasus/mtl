import React from 'react';
import { useAccessToken } from '../components/MTLProvider';
import { HttpConnector } from '../lib/HttpConnector';
import { Fetcher } from '../lib/Fetcher';

export const useFetcher = () => {
  const accessToken = useAccessToken();
  const httpConnector = React.useMemo(
    () =>
      new HttpConnector({
        accessToken,
      }),
    [accessToken]
  );
  return React.useMemo(() => new Fetcher(httpConnector), [httpConnector]);
};
