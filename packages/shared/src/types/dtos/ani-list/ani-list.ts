export interface GenreResult {
  Page: {
    media: {
      genres: string[];
    }[];
  };
}

export interface Result {
  data: {
    Page: {
      pageInfo: {
        total: number;
        currentPage: number;
        lastPage: number;
        hasNextPage: boolean;
        perPage: number;
      };
      media: BaseMediaType[];
    };
  };
}

export interface SearchResponse {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
  items: BaseMediaType[];
}

export type AnilistMangaStatusType =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export interface BaseMediaType {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description?: string;
  trending: number;
  averageScore?: number;
  bannerImage?: string;
  coverImage: {
    large?: string;
    medium?: string;
    color?: string;
  };
  genres: string[];
  status: AnilistMangaStatusType;
}

export interface AnilistManga extends BaseMediaType {
  chapters: any;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };

  volumes?: number;
  format?:
    | "MANGA"
    | "NOVEL"
    | "ONE_SHOT"
    | "DOUJIN"
    | "LIGHT_NOVEL"
    | "MANHWA"
    | "MANHUA";
}

export interface InfoResponse {
  data: {
    Media: AniMangaInfo;
  };
}

export interface AniMangaInfo extends AnilistManga {
  siteUrl: string;
}
