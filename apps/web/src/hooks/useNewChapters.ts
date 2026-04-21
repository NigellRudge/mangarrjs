import useSWR from "swr";
import { backendClient } from "@/http/api-client";

const useNewChapters = (): {
  newChapters: any[];
  isLoading?: boolean;
  type: "chapter" | "manga";
} => {
  const { data: newChapters = [], isValidating: isLoading } = useSWR(
    "new-chapters",
    () => backendClient.getNewChapters(),
    { revalidateOnFocus: false },
  );

  return {
    newChapters,
    isLoading,
    type: "chapter",
  };
};

export default useNewChapters;
