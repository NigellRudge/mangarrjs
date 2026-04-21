import axios, { AxiosInstance } from "axios";
import DocumentParser from "@utils/document-parser";
import {
  ChapterListItem,
  MangaInfoResponse,
  MangaListItem,
  MangaSourceGenre,
} from "@mangaClients/shared/types";
import { SearchFilters } from "@utils/request-utils";

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
  MangaListItem,
  ChapterListItem,
  MangaSourceGenre,
  MangaInfoResponse
> {
  protected readonly client!: AxiosInstance;
  protected documentParser!: DocumentParser;

  protected constructor(baseURL: string, headers: Record<string, any> = {}) {
    this.client = axios.create({ baseURL, headers });
  }

  public abstract getGenres(): Promise<MangaSourceGenre[]>;

  public abstract quickSearch(query: string): Promise<MangaListItem[]>;

  public abstract search(
    query: string,
    filters?: SearchFilters,
  ): Promise<MangaListItem[]>;

  public abstract getNewChapters(): Promise<ChapterListItem[]>;

  public abstract getInfo(id: string | number): Promise<MangaInfoResponse>;

  getChapters(id: string): Promise<ChapterListItem[]> {
    throw new Error("Method not implemented.");
  }
  getTrendingMangas(): Promise<MangaListItem[]> {
    throw new Error("Method not implemented.");
  }
  getTrendingChapters(): Promise<ChapterListItem[]> {
    throw new Error("Method not implemented.");
  }
}
