import { MangaStatus } from "../../reponse-types";

export interface MangaDexResponse<T> {
  result: "ok" | "error";
  response: string;
  data: T;
}

export interface MangaDexListResponse<T> {
  result: "ok" | "error";
  response: "collection";
  data: T[];
  limit: number;
  offset: number;
  total: number;
}

export type MangaDexMangaListResponse = MangaDexListResponse<MangaDexManga>;
export type MangaDexChapterListResponse = MangaDexListResponse<MangaDexManga>;
export type MangaDexMangaInfoResponse = MangaDexResponse<MangaDexManga>;
export type MangaDexChapterInfoResponse = MangaDexResponse<MangaDexChapter>;

export interface MangaDexManga {
  id: string;
  type: "manga";
  attributes: MangaAttributes;
  relationships: Relationship[];
}

interface MangaAttributes {
  title: LocalizedString;
  altTitles: LocalizedString[];
  description: LocalizedString;
  status: MangaStatus;
  year?: number;
  contentRating: "safe" | "suggestive" | "erotica" | "pornographic";
  tags: MangaDexTag[];
  latestUploadedChapter?: string;
}

export interface MangaDexTag {
  id: string;
  type: "tag";
  attributes: {
    name: LocalizedString;
    group: string;
  };
}

interface LocalizedString {
  [languageCode: string]: string;
}

export interface Relationship {
  id: string;
  type:
    | "author"
    | "artist"
    | "cover_art"
    | "manga"
    | "scanlation_group"
    | "user";
  attributes?: any; // refined below for specific cases
}

export interface MangaDexChapter {
  id: string;
  type: "chapter";
  attributes: {
    title?: string;
    chapter?: string;
    volume?: string;
    translatedLanguage: string;
    publishAt: string;
    readableAt: string;
    createdAt: string;
    updatedAt: string;
    pages: number;
    coverImage?: string;
  };
  relationships: Relationship[];
}

export interface MangaDexCover {
  id: string;
  type: string;
  attributes: {
    description: string;
    volume: string;
    fileName: string;
    locale: string;
    createdAt: string;
    updatedAt: string;
    version: number;
  };
  relationships: Relationship[];
}
