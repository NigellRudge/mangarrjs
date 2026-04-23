import {
  getMangaGenresQuery,
  mangaMetadataQuery,
  searchGraphQlQuery,
  popularMangasQuery,
} from "@graphQL/graphql-queries";

import Injectable from "@decorators/injectable";
import { NotFoundError, GeneralError } from "@mangarr/shared/errors";

import MangaDexClient from "@mangaClients/manga-dex";
import {
  ChapterResponse,
  MangaInfoResponse,
  MangaResponse,
  MangaSourceGenre,
} from "@mangarr/shared";
import { hasItems } from "@mangarr/shared/list";
import { SearchFilters } from "@mangarr/shared";
import MangaSourceClient from "@mangarr/shared/http";
import { AniListDTO } from "@mangarr/shared/dtos";
import {
  GenreResult,
  InfoResponse,
  Result,
} from "@mangarr/shared/types/ani-list";

const BASE_URL = "https://graphql.anilist.co";

@Injectable()
export default class AnilistApiClient extends MangaSourceClient {
  constructor(private readonly mangaDexClient: MangaDexClient) {
    super(BASE_URL, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  search = async (
    query: string,
    searchFilters: SearchFilters = { page: 1, pageSize: 10 },
  ): Promise<MangaResponse[]> => {
    const { pageSize: perPage, page, genres } = searchFilters;
    const filters: Record<string, any> = {
      search: query,
      perPage,
      page,
    };
    if (hasItems(genres)) {
      filters["genres"] = genres!;
    }
    const response = await this.makeGraphqlListRequest(
      searchGraphQlQuery,
      filters,
    );
    if (!response) {
      throw new NotFoundError("could not find any results");
    }
    return response.Page.media.map((manga, index) =>
      AniListDTO.createMangaResponse(manga, index),
    );
  };

  quickSearch = async (query: string): Promise<MangaResponse[]> =>
    (await this.search(query, { page: 1, pageSize: 5 })).slice(0, 5);

  getTrendingMangas = async (
    page: number = 1,
    perPage: number = 10,
  ): Promise<MangaResponse[]> => {
    const response = await this.makeGraphqlListRequest(popularMangasQuery, {
      perPage,
      page,
    });
    if (!response) {
      throw new GeneralError("could not load trending mangas");
    }
    return response.Page.media
      .map((item, index) => AniListDTO.createMangaResponse(item, index, true))
      .filter((manga) => Boolean(manga.bannerImage))
      .slice(0, 10);
  };

  getGenres = async (): Promise<MangaSourceGenre[]> => {
    const response = await this.client.post<GenreResult>("", {
      query: getMangaGenresQuery,
      variables: {},
    });
    if (!response || !response.data) {
      throw new NotFoundError("no genres found");
    }
    return AniListDTO.createGenreResponse(response.data);
  };

  getInfo = async (mangaId: string): Promise<MangaInfoResponse> => {
    const response = await this.makeGraphqlInfoRequest(mangaMetadataQuery, {
      id: mangaId,
    });
    if (!response.data) {
      throw new NotFoundError("could not find info info");
    }
    return AniListDTO.createMangaInfoResponse(response.data.Media);
  };
  getNewChapters = async (): Promise<ChapterResponse[]> =>
    await this.mangaDexClient.getNewChapters();

  private makeGraphqlInfoRequest = async (
    graphQlQuery: string,
    config: Record<string, any>,
  ): Promise<InfoResponse> => {
    const response = await this.client.post<InfoResponse>("", {
      query: graphQlQuery,
      variables: {
        ...config,
      },
    });
    if (!response || !response.data.data) {
      throw new GeneralError("GraphQL Error");
    }
    return response.data;
  };

  private makeGraphqlListRequest = async (
    graphQlQuery: string,
    config: Record<string, any>,
  ) => {
    const response = await this.client.post<Result>("", {
      query: graphQlQuery,
      variables: {
        ...config,
      },
    });
    if (!response || !response.data.data) {
      throw new GeneralError("GraphQL Error");
    }
    return response.data.data;
  };
}
