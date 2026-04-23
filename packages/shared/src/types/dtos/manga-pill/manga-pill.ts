import { MangaSourceType, MangaStatus } from "../../reponse-types";

export type MangaPillManga = {
  id: string | number;
  name: string;
  coverImage: string;
  chapterNumber?: number;
  chapterUrl?: string;
  mangaUrl?: string;
  type: "manga";
};

export type MangaPillChapter = {
  name: string;
  coverImage: string;
  chapterNumber?: string;
  chapterUrl?: string;
  mangaUrl?: string;
  type: "chapter";
};

export type MangePillMangaInfo = {
  id: string;
  title: string;
  description: string;
  genres: string[];
  coverImage: string;
  releaseDate: Date;
  source: MangaSourceType;
  status: MangaStatus;
  bannerImage?: string;
  chapters?: number;
};
