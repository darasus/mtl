import { Route } from '@mtl/types';

export const createApiRoute = ({
  route,
  query,
  variable,
}: {
  route: Route;
  variable?: {
    [key: string]: string;
  };
  query?: string;
}) => {
  if (variable) {
    const firstKey = Object.keys(variable || {})?.[0];
    return `/api/${route.replace(`:${firstKey}`, variable[firstKey])}${
      query ? `?${query}` : ''
    }`;
  }

  return `/api/${route}${query ? `?${query}` : ''}`;
};
