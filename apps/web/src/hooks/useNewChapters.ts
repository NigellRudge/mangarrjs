import useSWR from "swr";
import { backendClient } from "@/http/api-client";
import { ChapterResponse, MangaResponse } from "@mangarr/shared";

const useNewChapters = (): {
  newChapters: MangaResponse[] | ChapterResponse[];
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
