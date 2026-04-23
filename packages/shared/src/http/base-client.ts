import axios, { AxiosInstance } from "axios";

import { SearchFilters } from "@mangarr/shared";
import DocumentParser from "@mangarr/shared/document-parser";
import {
  ChapterResponse,
  MangaInfoResponse,
  MangaResponse,
  MangaSourceGenre,
} from "../types/reponse-types";

export interface BaseClient<T, C, G, M> {
  quickSearch(query: string): Promise<T[]>;
  search(query: string, filters?: SearchFilters): Promise<T[]>;
  getNewChapters(): Promise<C[]>;
  getInfo(id: string | number): Promise<M>;
  getChapters(id: string): Promise<C[]>;
  getTrendingMangas(): Promise<T[]>;
  getTrendingChapters(): Promise<C[]>;
  getGenres(): Promise<G[]>;
}

export default abstract class MangaSourceClient implements BaseClient<
  MangaResponse,
  ChapterResponse,
  MangaSourceGenre,
  MangaInfoResponse
> {
  protected readonly client!: AxiosInstance;
  protected documentParser!: DocumentParser;

  protected constructor(baseURL: string, headers: Record<string, any> = {}) {
    this.client = axios.create({ baseURL, headers });
  }

  public abstract getGenres(): Promise<MangaSourceGenre[]>;

  public abstract quickSearch(query: string): Promise<MangaResponse[]>;

  public abstract search(
    query: string,
    filters?: SearchFilters,
  ): Promise<MangaResponse[]>;

  public abstract getNewChapters(): Promise<ChapterResponse[]>;

  public abstract getInfo(id: string | number): Promise<MangaInfoResponse>;

  getChapters(id: string): Promise<ChapterResponse[]> {
    throw new Error("Method not implemented.");
  }
  getTrendingMangas(): Promise<MangaResponse[]> {
    throw new Error("Method not implemented.");
  }
  getTrendingChapters(): Promise<ChapterResponse[]> {
    throw new Error("Method not implemented.");
  }
}
