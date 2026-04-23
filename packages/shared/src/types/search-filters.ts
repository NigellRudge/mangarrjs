import {MangaSourceType} from "./reponse-types";

export type SearchFilters = Partial<{
    sourceId: MangaSourceType;
    page: number;
    pageSize: number;
    genres: string[];
    includeAdultContent?: boolean;
}>;

export const HEADER_CONTENT_TYPES = {
    AVIF: "image/avif",
    WEBP: "image/webp",
    JPG: "image/jpeg",
} as const;

export type HeaderImageContentType =
    (typeof HEADER_CONTENT_TYPES)[keyof typeof HEADER_CONTENT_TYPES];