import { Request } from "express";
import url from "url";
import * as queryString from "node:querystring";
import { MangaSourceType } from "@mangaClients/shared/types";

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

export const getRequestParams = (
  request: Request,
  key: string,
  type: "number" | "string" | "array",
) => {
  if (!request) return null;
  if (type === "array") {
    return request.params[key];
  }
  const paramValue = Array.isArray(request.params[key])
    ? request.params[key][0]
    : request.params[key];

  if (type === "number") {
    return parseInt(paramValue);
  }

  return paramValue;
};

export const getRequestQuery = (
  request: Request,
  key: string,
  type: "number" | "string" | "array",
) => {
  if (!request) return null;
  const parsedQuery = url.parse(request.url, true);
  if (type === "array") {
    const items = Array.isArray(parsedQuery.query[key])
      ? parsedQuery.query[key]
      : [parsedQuery.query[key]];
    return items.filter(Boolean);
  }
  const paramValue = Array.isArray(parsedQuery.query[key])
    ? parsedQuery.query[key][0]
    : parsedQuery.query[key];

  if (
    type === "number" &&
    Boolean(paramValue) &&
    typeof paramValue === "string"
  ) {
    return parseInt(paramValue);
  }

  return paramValue;
};

export const createQueryParams = (queryParameters?: Record<string, any>) => {
  if (!queryParameters) {
    return "";
  }
  return queryString.stringify(queryParameters);
};

export const getSearchFilters = (req: Request): SearchFilters => {
  const sourceId = getRequestQuery(req, "source", "string") as MangaSourceType;
  const page = (getRequestQuery(req, "page", "number") as number) || 1;
  const pageSize = (getRequestQuery(req, "pageSize", "number") as number) || 25;
  const genres = (getRequestQuery(req, "genres", "array") as string[]) || [];

  return {
    sourceId,
    page,
    genres,
    pageSize,
  };
};

export const getHeaderContentType = (req: Request): HeaderImageContentType => {
  const accept = req.headers["accept"];
  if (typeof accept === "string") {
    if (accept.includes(HEADER_CONTENT_TYPES.AVIF)) {
      return HEADER_CONTENT_TYPES.AVIF;
    }
    if (accept.includes(HEADER_CONTENT_TYPES.WEBP)) {
      return HEADER_CONTENT_TYPES.WEBP;
    }
  }
  return HEADER_CONTENT_TYPES.JPG;
};
