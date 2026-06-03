import {
  AnilistMangaStatusType,
  AniMangaInfo,
  BaseMediaType,
  GenreResult,
} from "./ani-list";
import {
  MangaInfoResponse,
  MangaResponse,
  MangaSourceGenre,
  MangaStatus,
} from "../../response-types";
import { hasItems, joinSafe } from "../../../utils/list";
import { flatten, pipe, uniq } from "ramda";

export class AniListDTO {
  public static createMangaResponse(
    manga: BaseMediaType,
    index?: number,
    selectLargestImage?: boolean,
  ): MangaResponse {
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
  }

  public static flattenArray(
    media: {
      genres: string[];
    }[],
  ): string[] {
    if (!hasItems(media)) return [];
    return pipe(
      (media: { genres: string[] }[]) => media.map((m) => m.genres),
      flatten,
      uniq,
    )(media);
  }

  public static createGenreResponse(genres: GenreResult): MangaSourceGenre[] {
    const flattenGenres = this.flattenArray(genres.data.Page.media);

    if (!hasItems(flattenGenres)) return [];

    return flattenGenres.map((genre) => ({
      sourceId: "ani-list",
      id: `ani-list-${genre}`,
      name: genre,
    }));
  }

  public static createMangaInfoResponse(
    manga: AniMangaInfo,
  ): MangaInfoResponse {
    return {
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
      status: this.statusMap[manga.status],
      chapters: manga.chapters || 0,
    };
  }

  public static statusMap: Record<AnilistMangaStatusType, MangaStatus> = {
    FINISHED: MangaStatus.finished,
    RELEASING: MangaStatus.ongoing,
    NOT_YET_RELEASED: MangaStatus.upcoming,
    CANCELLED: MangaStatus.canceled,
    HIATUS: MangaStatus.hiatus,
  };
}
