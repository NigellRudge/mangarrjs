import { MangaResponse, MangaSourceType } from "../response-types";
import { slugifyTitle } from "../../utils/request-utils";
import { concat, flatten, pipe, uniqBy } from "ramda";
import { sortArrayBySortOrder } from "../../utils/sorting";

export const MangaSourceUrlMap: Record<MangaSourceType, string> = {
  "ani-list": "https://anilist.co",
  "manga-dex": "https://mangadex.org/",
  "manga-pill": "https://mangapill.com/",
};

export const mergeSourceResults = (
  resultsMap: Record<MangaSourceType, MangaResponse[]>,
): MangaResponse[] => {
  if (!resultsMap) return [];
  const map = new Map<string, MangaResponse>();

  for (const [key, results] of Object.entries(resultsMap)) {
    for (const manga of results) {
      const mapKey = slugifyTitle(manga.title);
      const oldManga = map.get(mapKey);
      const mangaInfo = oldManga || manga;

      const mergedManga = {
        ...mangaInfo,
        media: concat(oldManga?.media || [], manga.media),
        otherIds: {
          ...mangaInfo.otherIds,
          [key]: manga.id.toString(),
        },
      };
      map.set(mapKey, mergedManga);
    }
  }
  return Array.from(map.values());
};

export const mergeGenresResults = (
  resultsMap: Record<string, string[]>,
): string[] => {
  if (!resultsMap) return [];

  return pipe(
    (results: Record<string, string[]>) => Object.values(results),
    flatten,
    uniqBy((genre: string) => slugifyTitle(genre)),
    (genres) => sortArrayBySortOrder(genres, "genre"),
  )(resultsMap);
};
