import React from "react";
import { ClientHttpConnector } from "../lib/ClientHttpConnector";
import { Fetcher } from "../lib/Fetcher";

export const useFetcher = () => {
  const httpConnector = React.useMemo(() => new ClientHttpConnector(), []);
  return React.useMemo(() => new Fetcher(httpConnector), [httpConnector]);
};
