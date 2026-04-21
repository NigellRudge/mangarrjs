import {
  getMangaGenresQuery,
  mangaMetadataQuery,
  searchGraphQlQuery,
  popularMangasQuery,
} from "@graphQL/graphql-queries";
import {
  GenreResult,
  InfoResponse,
  Result,
} from "@mangaClients/ani-list/types";
import GeneralError from "@errors/general-error";
import Injectable from "@decorators/injectable";
import NotFoundError from "@errors/not-found-error";
import MangaSourceClient from "@mangaClients/shared/base-client";
import Config from "./config";
import {
  ChapterListItem,
  MangaInfoResponse,
  MangaListItem,
  MangaSourceGenre,
} from "@mangaClients/shared/types";
import {
  normalizeAnilistGenres,
  normalizeAnilistInfo,
  normalizeAnilistManga,
} from "@mangaClients/ani-list/utils";
import MangaDexClient from "@mangaClients/manga-dex";
import { hasItems } from "@utils/list";
import { SearchFilters } from "@utils/request-utils";

const { BASE_URL } = Config;

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
  ): Promise<MangaListItem[]> => {
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
    return response.Page.media.map((item, index) =>
      normalizeAnilistManga(item, index),
    );
  };

  quickSearch = async (query: string): Promise<MangaListItem[]> =>
    (await this.search(query, { page: 1, pageSize: 5 })).slice(0, 5);

  getTrendingMangas = async (page: number = 1, perPage: number = 10) => {
    const response = await this.makeGraphqlListRequest(popularMangasQuery, {
      perPage,
      page,
    });
    if (!response) {
      throw new GeneralError("could not load trending mangas");
    }
    return response.Page.media
      .map((item, index) => normalizeAnilistManga(item, index, true))
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
    return normalizeAnilistGenres(response.data);
  };

  getInfo = async (mangaId: string): Promise<MangaInfoResponse> => {
    const response = await this.makeGraphqlInfoRequest(mangaMetadataQuery, {
      id: mangaId,
    });
    if (!response.data) {
      throw new NotFoundError("could not find info info");
    }
    return normalizeAnilistInfo(response.data.Media);
  };
  getNewChapters = async (): Promise<ChapterListItem[]> =>
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
