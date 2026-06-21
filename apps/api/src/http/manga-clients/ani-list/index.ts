import {
  getMangaGenresQuery,
  mangaMetadataQuery,
  searchGraphQlQuery,
  popularMangasQuery,
  browseGraphQlQuery,
  healthCheckQuery,
} from "@graphQL/graphql-queries";

import Injectable from "@decorators/injectable";
import { NotFoundError, GeneralError } from "@mangarr/shared/errors";

import MangaDexClient from "@mangaClients/manga-dex";
import {
  ChapterResponse,
  MangaInfoResponse,
  MangaResponse,
  MangaSourceGenre,
  DiscoverFilters,
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
import { flatten, pipe, uniq } from "ramda";
import { GetWordsForMangaSource } from "@mangarr/shared/synonyms";

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

  public async search(
    query: string,
    searchFilters: SearchFilters = { page: 1, pageSize: 10 },
  ): Promise<MangaResponse[]> {
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
  }

  public async discoverMangas(
    inputFilters: DiscoverFilters,
  ): Promise<MangaResponse[]> {
    const { pageSize: perPage, page, genres } = inputFilters;
    const filters: Record<string, any> = {
      perPage: perPage || 25,
      page: page || 1,
    };

    if (hasItems(genres)) {
      const filterGenres = GetWordsForMangaSource(genres || [], "ani-list");
      if (!hasItems(filterGenres)) {
        return [];
      }
      filters["genres"] = filterGenres;
    }
    const response = await this.makeGraphqlListRequest(
      browseGraphQlQuery,
      filters,
    );
    if (!response) {
      throw new NotFoundError("could not find any results");
    }
    return response.Page.media.map((manga, index) =>
      AniListDTO.createMangaResponse(manga, index),
    );
  }

  public async quickSearch(query: string): Promise<MangaResponse[]> {
    return (await this.search(query, { page: 1, pageSize: 5 })).slice(0, 5);
  }

  public async getTrendingMangas(
    page: number = 1,
    perPage: number = 10,
  ): Promise<MangaResponse[]> {
    const response = await this.makeGraphqlListRequest(popularMangasQuery, {
      perPage,
      page,
    });
    if (!response) {
      throw new GeneralError("could not load trending mangas");
    }
    return response.Page.media
      .map((item, index) => AniListDTO.createMangaResponse(item, index, true))
      .slice(0, 5);
  }

  public async getGenres(): Promise<MangaSourceGenre[]> {
    const response = await this.client.post<GenreResult>("", {
      query: getMangaGenresQuery,
      variables: {},
    });
    if (!response || !response.data) {
      throw new NotFoundError("no genres found");
    }

    return AniListDTO.createGenreResponse(response.data);
  }

  public async getInfo(mangaId: string): Promise<MangaInfoResponse> {
    const response = await this.makeGraphqlInfoRequest(mangaMetadataQuery, {
      id: mangaId,
    });
    if (!response.data) {
      throw new NotFoundError("could not find info info");
    }
    return AniListDTO.createMangaInfoResponse(response.data.Media);
  }
  public async getNewChapters(): Promise<ChapterResponse[]> {
    return await this.mangaDexClient.getNewChapters();
  }

  public async getMediaStatusTypes(): Promise<string[]> {
    return ["FINISHED", "RELEASING", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"];
  }

  public async getSupportedMediaTypes(): Promise<string[]> {
    return [
      "MANGA",
      "NOVEL",
      "ONE_SHOT",
      "DOUJIN",
      "LIGHT_NOVEL",
      "MANHWA",
      "MANHUA",
    ];
  }

  public async isHealthy(): Promise<Boolean> {
    try {
      const response = await this.client.post<InfoResponse>("", {
        query: healthCheckQuery,
      });
      return response.status === 200;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private async makeGraphqlInfoRequest(
    graphQlQuery: string,
    config: Record<string, any>,
  ): Promise<InfoResponse> {
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
  }

  private async makeGraphqlListRequest(
    graphQlQuery: string,
    config: Record<string, any>,
  ) {
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
  }
}
