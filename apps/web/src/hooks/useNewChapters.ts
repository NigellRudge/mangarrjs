import useSWR from "swr";
import { ChapterResponse, MangaResponse } from "@mangarr/shared";
import { searchClient } from "@/http/search-client";

const useNewChapters = (): {
  newChapters: MangaResponse[] | ChapterResponse[];
  isLoading?: boolean;
  type: "chapter" | "manga";
} => {
  const { data: newChapters = [], isValidating: isLoading } = useSWR(
    "new-chapters",
    () => searchClient.getNewChapters(),
    { revalidateOnFocus: false },
  );

  return {
    newChapters,
    isLoading,
    type: "chapter",
  };
};

export default useNewChapters;
