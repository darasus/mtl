import { CodeLanguage } from ".prisma/client";
import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

interface Variables {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
  tagId: string;
  isPublished: boolean;
}

const toastConfig = {
  loading: "Creating library...",
  success: "Library created!",
  error: "Library is not created.",
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    (variables: Variables) =>
      withToast(fetcher.createPost(variables), toastConfig),
    {
      async onSettled() {
        await queryClient.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
