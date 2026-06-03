import { MangaSourceType } from "./response-types";

export type SearchFilters = Partial<{
  sourceId: MangaSourceType;
  page: number;
  pageSize: number;
  genres: string[];
  includeAdultContent?: boolean;
}>;

export type SortFilter =
  | "release-asc"
  | "release-desc"
  | "rating-asc"
  | "rating-desc"
  | "name-asc"
  | "name-desc";

export type DiscoverFilters = Partial<{
  page: number;
  pageSize: number;
  sources?: MangaSourceType[];
  genres: string[];
  mediaTypes: string[];
  statusTypes: string[];
  includeAdultContent?: boolean;
  sort?: SortFilter;
}>;

export const HEADER_CONTENT_TYPES = {
  AVIF: "image/avif",
  WEBP: "image/webp",
  JPG: "image/jpeg",
} as const;

export type HeaderImageContentType =
  (typeof HEADER_CONTENT_TYPES)[keyof typeof HEADER_CONTENT_TYPES];
