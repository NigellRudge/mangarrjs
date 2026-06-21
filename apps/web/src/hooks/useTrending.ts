import { ChapterResponse, MangaResponse } from "@mangarr/shared";
import useSWR from "swr";
import { searchClient } from "@/http/search-client";

const useTrending = (): {
  trendingMangas: MangaResponse[] | ChapterResponse[];
  isLoading?: boolean;
  type: "manga";
} => {
  const { data: trendingMangas = [], isValidating: isLoading } = useSWR(
    "new-chapters",
    () => searchClient.getTrendingManga(),
    { revalidateOnFocus: false },
  );

  return {
    trendingMangas,
    isLoading,
    type: "manga",
  };
};

export default useTrending;
