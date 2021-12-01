import { Text } from "@chakra-ui/layout";
import toast from "react-hot-toast";

export function withToast<T>(
  fetcher: Promise<T>,
  config: { loading: string; success: string; error: string }
) {
  return toast.promise(fetcher, {
    loading: <Text fontSize="sm">{config.loading}</Text>,
    success: <Text fontSize="sm">{config.success}</Text>,
    error: <Text fontSize="sm">{config.error}</Text>,
  });
}
