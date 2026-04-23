export enum MangaStatus {
  ongoing = "ongoing",
  finished = "finished",
  canceled = "canceled",
  hiatus = "hiatus",
  upcoming = "hiatus",
}

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

export type MangaResponse = ListItem & {
  id: string | number;
  title: string;
  coverImage: string;
  sourceId: MangaSourceType;
  bannerImage?: string;
  description?: string;
};

export type MangaInfoResponse = {
  id: string | number;
  title: string;
  coverImage: string;
  sourceId: MangaSourceType;
  bannerImage?: string;
  originalTitle?: string;
  publishDate: Date;
  genres?: string[];
  tags?: string[];
  status: MangaStatus;
  description: string;
  chapters?: number;
  averageScore?: number;
};

export type ChapterResponse = {
  id?: string | number;
  title: string;
  coverImage: string;
  sourceId: MangaSourceType;
  mangaId?: string | null;
  chapterNumber?: string;
  translatedLanguage: string;
  releaseDate?: Date;
  description?: string;
};

export type MangaSourceGenre = {
  id: string;
  name: string;
  sourceId: string;
};
