import Injectable from "@decorators/injectable";
import MangaDexClient from "@mangaClients/manga-dex";
import CacheService from "@services/cache-service";
import { iocContainer } from "@iocContainer/ioc-container";
import MangaPillClient from "@mangaClients/manga-pill";
import { MangaSourceType } from "@mangaClients/shared/types";
import AnilistApiClient from "@mangaClients/ani-list";
import { SearchFilters } from "@mangarr/shared";
import { GeneralError } from "@mangarr/shared/errors";
import { mergeRight } from "ramda";
import { removeEmptyKeys } from "@mangarr/shared";
import MangaSourceClient from "@mangarr/shared/http";

@Injectable()
export default class SearchService {
  constructor(private readonly cacheService: CacheService) {}

  search = async (query: string, filters?: SearchFilters) => {
    const selectedFilters = mergeRight<SearchFilters>(
      {
        sourceId: "manga-dex",
        page: 1,
        pageSize: 10,
        genres: [],
        includeAdultContent: false,
      },
      removeEmptyKeys<SearchFilters>(filters),
    );
    const { sourceId } = selectedFilters;
    if (!query) {
      throw new GeneralError("Error: No query provided");
    }
    if (!sourceId) {
      throw new GeneralError("Error: No source provided");
    }
    const redisKey = `search-${query.trim()}-${JSON.stringify(selectedFilters)}`;
    const cachedData = await this.cacheService.get(redisKey);
    if (cachedData) {
      return cachedData;
    }
    const mangaSourceClient = this.getMangaSourceClient(sourceId);
    const searchResult = await mangaSourceClient.search(query, selectedFilters);
    if (searchResult) {
      await this.cacheService.set(redisKey, searchResult, "30M");
    }
    return searchResult;
  };

  quickSearch = async (
    sourceId: MangaSourceType = "manga-dex",
    query: string,
  ) => {
    const redisKey = `quick-search-${JSON.stringify({ query, sourceId })}`;
    const cachedData = await this.cacheService.get(redisKey);
    if (cachedData) {
      return cachedData;
    }
    const mangaSourceClient = this.getMangaSourceClient(sourceId);
    const searchResult = await mangaSourceClient.quickSearch(query);
    if (searchResult) {
      await this.cacheService.set(redisKey, searchResult, "60M");
    }
    return searchResult;
  };

  getGenres = async (sourceId: MangaSourceType = "manga-dex") => {
    const redisKey = `genres-${sourceId}`;
    const cachedData = await this.cacheService.get(redisKey);
    if (cachedData) {
      return cachedData;
    }
    const mangaSourceClient = this.getMangaSourceClient(sourceId);
    const response = await mangaSourceClient.getGenres();
    if (response) {
      await this.cacheService.set(redisKey, response, "7D");
    }
    return response;
  };

  private getMangaSourceClient(
    mangaSourceId: MangaSourceType,
  ): MangaSourceClient {
    switch (mangaSourceId) {
      case "manga-dex":
        return iocContainer.resolve(MangaDexClient);
      case "manga-pill":
        return iocContainer.resolve(MangaPillClient);
      case "ani-list":
        return iocContainer.resolve(AnilistApiClient);
      default:
        return iocContainer.resolve(MangaDexClient);
    }
  }
}
