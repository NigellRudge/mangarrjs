export interface Genre {
  id: number;
  name: string;
}

export type MangaSourceType = "manga-dex" | "manga-pill" | "ani-list";

export type Media = {
  id: string;
  coverImage: string;
  title: string;
  sourceId: MangaSourceType;
  description: string;
};

export type Manga = Media & {
  author: string;
  releaseDate: Date | string;
  bannerImage?: string;
};

export type Chapter = Media & {
  title: string;
  mangaId?: string | null;
  chapterNumber?: string;
  coverImage: string;
  translatedLanguage: string;
  releaseDate?: Date;
  sourceId: MangaSourceType;
};

enum MangaStatus {
  ongoing = "ongoing",
  finished = "finished",
  canceled = "canceled",
  hiatus = "hiatus",
  upcoming = "upcoming",
}

export type MangaInfo = {
  id: string | number;
  bannerImage?: string;
  coverImage: string;
  title?: string;
  publishDate: Date;
  genres?: string[];
  tags?: string[];
  status: MangaStatus;
  description: string;
  chapters?: number;
  sourceId?: MangaSourceType;
  averageScore?: number;
};
