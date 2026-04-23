import { MangaDexChapter, MangaDexCover, MangaDexManga } from "./manga-dex";
import {
  ChapterResponse,
  MangaInfoResponse,
  MangaResponse,
} from "../../reponse-types";
import { hasItems, joinSafe } from "../../../utils/list";

export class MangaDexDTO {
  private static readonly MANGA_DEX_IMAGES_URL =
    "https://uploads.mangadex.org/covers/";
  private static readonlyMANGA_DEX_CHAPTER_IMG_URL: "at-home/server/";
  private static readonlyMANGA_DEX_BASE_URL: "https://api.mangadex.org";

  public static getCoverFileName(
    media: MangaDexManga | MangaDexChapter,
  ): string {
    if (!media || !hasItems(media?.relationships)) return "";
    const { relationships } = media;
    const covers = relationships.filter((rel) => rel.type === "cover_art");
    let cover = covers.find((cover) => cover.attributes?.locale === "en");

    if (!cover) {
      cover = covers[0];
    }
    if (!cover) return "";
    const fileName = cover?.attributes?.fileName;
    return `${this.MANGA_DEX_IMAGES_URL}${media.id}/${fileName}.256.jpg`;
  }

  public static getRelatedManga = (
    chapter: MangaDexChapter | MangaDexCover,
  ) => {
    if (!chapter || !hasItems(chapter.relationships)) return null;
    return chapter.relationships.find(
      (relationship) => relationship.type === "manga",
    );
  };

  public static getTitle(manga: any) {
    const {
      attributes: { title: titles, altTitles },
    } = manga;
    let title = titles["ja-ro"] || titles["en"];
    if (hasItems(altTitles)) {
      const englishTitle = altTitles.find((allTitle: any) =>
        Boolean(allTitle["en"]),
      );
      if (englishTitle) {
        title = englishTitle["en"];
      }
    }
    return title;
  }

  public static getGenres(manga: MangaDexManga) {
    if (!manga || !hasItems(manga?.attributes?.tags)) return [];
    return manga.attributes.tags
      .filter((tag) => {
        return tag.type === "tag" && tag.attributes.group === "genre";
      })
      .filter(Boolean)
      .map((tag) => {
        return tag.attributes.name["en"];
      });
  }

  public static mapCoverResponseToObject(
    covers: MangaDexCover[],
  ): Record<string, string> {
    const coverMap: Record<string, string> = {};
    for (const cover of covers) {
      const mangaId = cover.relationships.find((rel) => rel.type === "manga")
        ?.id as string;
      if (!mangaId) continue;

      if (Boolean(coverMap[mangaId])) continue;
      coverMap[mangaId] =
        `${this.MANGA_DEX_IMAGES_URL}${mangaId}/${cover.attributes.fileName}.512.jpg`;
    }
    return coverMap;
  }

  public static createMangaResponse(
    manga: MangaDexManga,
    index?: number,
  ): MangaResponse {
    const {
      id,
      attributes: { title: titles, altTitles, year, description, status },
    } = manga;
    let title = titles["en"] || titles["ja-ro"];
    if (hasItems(altTitles)) {
      const englishTitle = altTitles.find((allTitle) =>
        Boolean(allTitle["en"]),
      );
      if (englishTitle) {
        title = englishTitle["en"];
      }
    }

    return {
      title,
      id,
      sourceId: "manga-dex",
      coverImage: this.getCoverFileName(manga),
    };
  }

  public static createChapterResponse(
    chapter: MangaDexChapter,
    index?: number,
  ): ChapterResponse {
    const {
      attributes: {
        coverImage,
        chapter: chapterNumber,
        publishAt,
        translatedLanguage,
        title,
      },
    } = chapter;

    const manga = this.getRelatedManga(chapter);

    return {
      title: joinSafe([title, chapterNumber], ": #"),
      chapterNumber,
      releaseDate: new Date(publishAt),
      coverImage: coverImage || "",
      mangaId: manga?.id,
      translatedLanguage,
      sourceId: "manga-dex",
    };
  }

  public static createMangaInfoResponse(
    manga: MangaDexManga,
  ): MangaInfoResponse {
    return {
      id: manga.id,
      title: this.getTitle(manga),
      sourceId: "manga-dex",
      genres: this.getGenres(manga),
      coverImage: this.getCoverFileName(manga),
      status: manga.attributes.status,
      description: manga.attributes.description["en"],
      publishDate: new Date(`01-01-${manga.attributes.year}`),
    };
  }
}
