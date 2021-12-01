import { useMutation } from "react-query";
import { withToast } from "../../utils/withToast";
import { useRefetchUserProfile } from "../query/useRefetchUserProfile";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";
import { useUploadImageMutation } from "./useUploadImageMutation";
import React from "react";
import toast from "react-hot-toast";

interface Form {
  nickname?: string;
  name?: string;
  file?: File;
  password?: string;
  email?: string;
}

export const useUpdateUserSettingsMutation = () => {
  const fetcher = useFetcher();
  const me = useMe();
  const refetchUserProfileMutation = useRefetchUserProfile();
  const uploadImageMutation = useUploadImageMutation();

  const trigger = React.useCallback(
    async (form: Form) => {
      let image: string | undefined = undefined;
      if (form.file) {
        const formData = new FormData();

        formData.append("file", form.file);

        const imageResponse = await uploadImageMutation.mutateAsync({
          data: formData,
        });

        if (typeof imageResponse.imageUrl === "string") {
          image = imageResponse.imageUrl;
        }
      }

      await fetcher
        .updateUserSettings({
          userId: me?.user?.id as string,
          nickname: form.nickname,
          name: form.name,
          image,
          password: form.password,
        })
        .catch((err) => {
          if (typeof err?.response?.data?.error === "string") {
            toast.error(err?.response?.data?.error, { duration: 5000 });
          }
          throw new Error(err);
        });
      await refetchUserProfileMutation.refetch();
    },
    [fetcher, me?.user?.id, refetchUserProfileMutation, uploadImageMutation]
  );

  return useMutation((form: Form) => {
    return withToast(trigger(form), {
      loading: "Updating settings...",
      error: "Settings are not updated!",
      success: "Settings are updated.",
    });
  });
};
