export enum MangaStatus {
  ongoing = "ongoing",
  finished = "finished",
  canceled = "canceled",
  hiatus = "hiatus",
  upcoming = "upcoming",
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

export type MangaMedia = {
  url: string;
  sourceId: MangaSourceType;
  type: "cover" | "banner";
};

export type MangaResponse = {
  id: string | number;
  sourceId: MangaSourceType;
  title: string;
  media: Array<MangaMedia>;
  bannerImage?: string;
  description?: string;
  otherIds?: Record<string, string>;
  publishYear?: string;
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
  chapters?: ChapterResponse[];
  averageScore?: number;
};

export type ChapterResponse = {
  id?: string | number;
  sourceId: MangaSourceType;
  chapterNumber?: string;
  title: string;
  mangaId?: string | null;
  description?: string;
  translatedLanguage?: string;
  releaseDate?: Date;
  media: Array<{
    url: string;
    sourceId: MangaSourceType;
    type: "cover" | "banner";
  }>;
};

export type MangaSourceGenre = {
  id: string;
  name: string;
  sourceId: string;
};
