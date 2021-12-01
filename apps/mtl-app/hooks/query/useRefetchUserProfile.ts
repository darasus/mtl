import { useQuery } from "react-query";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

export const useRefetchUserProfile = () => {
  const me = useMe();
  const fetcher = useFetcher();
  return useQuery(
    "refetch-auth",
    async () => {
      await fetcher.refetchAuthUserProfile();
      await me?.checkSession();
    },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};
