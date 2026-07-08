import {
  MangaPillChapter,
  MangaPillManga,
  MangePillMangaInfo,
} from "./manga-pill";
import {
  ChapterResponse,
  MangaInfoResponse,
  MangaResponse,
} from "../../response-types";

export class MangaPillDTO {
  public static getMangaIdFromUrl(mangaUrl?: string): string | null {
    if (!mangaUrl) return null;
    const match = mangaUrl.match(/\d+/);
    if (!match) return null;
    return match[0];
  }

  public static mangaIdFormChapterUrl(chapterUrl?: string) {
    if (!chapterUrl) return null;
    const match = chapterUrl.match(/\/(\d+)-/);
    return match ? parseInt(match[1]) : null;
  }

  public static createMangaResponse(manga: MangaPillManga): MangaResponse {
    return {
      id: manga.id,
      title: manga.name,
      media: [{ url: manga.coverImage, type: "cover", sourceId: "manga-pill" }],
      sourceId: "manga-pill",
      otherIds: {},
    };
  }

  public static createChapterResponse(
    chapter: MangaPillChapter,
  ): ChapterResponse {
    return {
      title: chapter.name,
      mangaId: this.getMangaIdFromUrl(chapter.mangaUrl),
      chapterNumber: chapter.chapterNumber,
      media: [
        { url: chapter.coverImage, sourceId: "manga-pill", type: "cover" },
      ],
      translatedLanguage: "en",
      sourceId: "manga-pill",
    };
  }

  public static createInfoResponse = (
    manga: MangePillMangaInfo,
  ): MangaInfoResponse => ({
    id: manga.id,
    title: manga.title,
    publishDate: manga.releaseDate,
    genres: manga.genres,
    description: manga.description,
    sourceId: manga.source,
    coverImage: manga.coverImage,
    status: manga.status,
    chapters: manga.chapters,
  });
}
