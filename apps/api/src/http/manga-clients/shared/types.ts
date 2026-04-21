import { MangaStatus } from "@mangaClients/manga-dex/types";

export type MangaSourceType = "manga-dex" | "manga-pill" | "ani-list";

export const MangaSourceUrlMap: Record<MangaSourceType, string> = {
  "ani-list": "https://anilist.co",
  "manga-dex": "https://mangadex.org/",
  "manga-pill": "https://mangapill.com/",
};

export type ListItem = {
  title: string;
  coverImage: string;
  sourceId: MangaSourceType;
};

export type MangaListItem = ListItem & {
  id: string | number;
  bannerImage?: string;
};

export type MangaInfoResponse = MangaListItem & {
  originalTitle?: string;
  publishDate: Date;
  genres?: string[];
  status: MangaStatus;
  description: string;
  chapters?: number;
};

export type ChapterListItem = ListItem & {
  mangaId?: string | null;
  chapterNumber?: string;
  translatedLanguage: string;
  releaseDate?: Date;
};

export type ChapterInfo = ChapterListItem & {
  title: string;
  mangaTitle: string;
  chapterNumber?: string;
  coverImage: string;
  translatedLanguage: string;
  sourceId: MangaSourceType;
  releaseDate: Date;
};

export type MangaSourceGenre = {
  id: string;
  name: string;
  sourceId: string;
};
