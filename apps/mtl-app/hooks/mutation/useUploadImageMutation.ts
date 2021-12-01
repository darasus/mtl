import { useMutation } from "react-query";
import { useFetcher } from "../useFetcher";

interface Variables {
  data: FormData;
}

export const useUploadImageMutation = () => {
  const fetcher = useFetcher();
  return useMutation(async ({ data }: Variables) => fetcher.uploadImage(data));
};
