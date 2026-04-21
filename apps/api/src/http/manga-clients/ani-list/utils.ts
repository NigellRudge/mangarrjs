import {
  AnilistMangaStatusType,
  AniMangaInfo,
  BaseMediaType,
  GenreResult,
} from "@mangaClients/ani-list/types";
import {
  MangaInfoResponse,
  MangaListItem,
  MangaSourceGenre,
} from "@mangaClients/shared/types";
import { flatten, pipe, uniq } from "ramda";
import { hasItems, joinSafe } from "@utils/list";
import { MangaStatus } from "@mangaClients/manga-dex/types";

export const normalizeAnilistManga = (
  manga: BaseMediaType,
  index?: number,
  selectLargestImage: boolean = false,
): MangaListItem => {
  return {
    id: manga.id,
    title: manga.title.english || manga.title.romaji,
    coverImage: selectLargestImage
      ? manga.coverImage.large ||
        manga.coverImage.color ||
        manga.coverImage.medium ||
        ""
      : manga.coverImage.color ||
        manga.coverImage.large ||
        manga.coverImage.medium ||
        "",
    bannerImage: manga.bannerImage || manga.coverImage.large,
    sourceId: "ani-list",
  };
};

export const flattenArray = (
  media: {
    genres: string[];
  }[],
): string[] => {
  if (!hasItems(media)) return [];
  return pipe(flatten, uniq)(media);
};

export const normalizeAnilistGenres = (
  genres: GenreResult,
): MangaSourceGenre[] => {
  const flattenGenres = flattenArray(genres.Page.media);
  if (!hasItems(flattenGenres)) return [];
  return flattenGenres.map((genre) => ({
    sourceId: "ani-list",
    id: `ani-list-${genre}`,
    name: genre,
  }));
};

const statusMap: Record<AnilistMangaStatusType, MangaStatus> = {
  FINISHED: MangaStatus.finished,
  RELEASING: MangaStatus.ongoing,
  NOT_YET_RELEASED: MangaStatus.upcoming,
  CANCELLED: MangaStatus.canceled,
  HIATUS: MangaStatus.hiatus,
};

export const normalizeAnilistInfo = (
  manga: AniMangaInfo,
): MangaInfoResponse => ({
  id: manga.id,
  sourceId: "ani-list",
  genres: manga.genres,
  title: manga.title.english || manga.title.native || "",
  coverImage:
    manga.coverImage.color ||
    manga.coverImage.large ||
    manga.coverImage.medium ||
    "",
  publishDate: new Date(
    joinSafe(
      [manga.startDate.day, manga.startDate.month, manga.startDate.year],
      "-",
    ),
  ),
  description: manga.description || "",
  status: statusMap[manga.status],
  chapters: manga.chapters || 0,
});
