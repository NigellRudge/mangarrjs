import {
  MangaPillChapter,
  MangaPillManga,
  MangePillMangaInfo,
} from "@mangaClients/manga-pill/types";
import {
  ChapterListItem,
  MangaInfoResponse,
  MangaListItem,
} from "@mangaClients/shared/types";

export const normalizeMangaPillManga = (
  manga: MangaPillManga,
): MangaListItem => {
  return {
    id: manga.id,
    title: manga.name,
    coverImage: manga.coverImage,
    sourceId: "manga-pill",
  };
};

export const getMangaIdFromUrl = (mangaUrl?: string) => {
  if (!mangaUrl) return null;
  const match = mangaUrl.match(/\d+/);
  if (!match) return null;
  return match[0];
};

export const mangaIdFormChapterUrl = (chapterUrl?: string) => {
  if (!chapterUrl) return null;
  const match = chapterUrl.match(/\/(\d+)-/);
  return match ? parseInt(match[1]) : null;
};

export const normalizeMangaPillChapter = (
  chapter: MangaPillChapter,
): ChapterListItem => {
  return {
    title: chapter.name,
    mangaId: getMangaIdFromUrl(chapter.mangaUrl),
    chapterNumber: chapter.chapterNumber,
    coverImage: chapter.coverImage,
    translatedLanguage: "en",
    sourceId: "manga-pill",
  };
};

export const normalizeMangaPillInfo = (
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
});
