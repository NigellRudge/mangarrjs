import Injectable from "@decorators/injectable";
import CacheService from "@services/cache-service";
import { DiscoverFilters, slugifyTitle } from "@mangarr/shared";
import { mergeRight } from "ramda";
import { hasItems, removeEmptyKeys } from "@mangarr/shared/list";
import MangaDexClient from "@mangaClients/manga-dex";
import MangaPillClient from "@mangaClients/manga-pill";
import AnilistApiClient from "@mangaClients/ani-list";
import { MangaResponse, MangaSourceType } from "@mangarr/shared/";
import MangaSourceClient from "@mangarr/shared/http";
import { iocContainer } from "@iocContainer/ioc-container";
import { pipe, uniqBy, flatten } from "ramda";
import { normalizeWordsForSources } from "@mangarr/shared/synonyms";
import { sortArrayBySortOrder } from "@mangarr/shared/sorting";

@Injectable()
export default class DiscoverService {
  private readonly sourceClientMap: Record<
    string,
    new (...args: any[]) => MangaSourceClient
  > = {
    "manga-dex": MangaDexClient,
    "manga-pill": MangaPillClient,
    "ani-list": AnilistApiClient,
  };

  constructor(private readonly cacheService: CacheService) {}

  public async discover(filters: DiscoverFilters) {
    const selectedFilters = mergeRight<DiscoverFilters>(
      {
        page: 1,
        pageSize: 25,
        genres: [],
        includeAdultContent: false,
      },
      removeEmptyKeys<DiscoverFilters>(filters),
    );

    const redisKey = `discover-${JSON.stringify(selectedFilters)}`;
    const cachedData = await this.cacheService.get(redisKey);
    if (cachedData) {
      return cachedData;
    }

    const resultsMap: Record<string, MangaResponse[]> = {};
    const selectedSources = (
      hasItems(filters.sources)
        ? filters.sources
        : Object.keys(this.sourceClientMap)
    ) as MangaSourceType[];

    const clientRequestPromises = selectedSources.map(async (source) => {
      try {
        const client = iocContainer.resolve<MangaSourceClient>(
          this.sourceClientMap[source],
        );
        const isClientHealthy = await client.isHealthy();
        if (isClientHealthy) {
          const response = await client.discoverMangas(filters);
          if (response && hasItems(response)) {
            resultsMap[source] = response;
          }
        }
      } catch (error) {
        console.log("could not load for source", source);
        console.log(error);
      }
    });
    await Promise.all(clientRequestPromises);
    const mergedResults = this.mergeSourceResults(resultsMap);
    if (hasItems(mergedResults)) {
      await this.cacheService.set(redisKey, mergedResults, "1D");
    }
    return mergedResults;
  }

  public async getFacets() {
    const selectedSources = Object.keys(
      this.sourceClientMap,
    ) as MangaSourceType[];
    const redisKey = `discover-facets-${JSON.stringify(selectedSources)}`;
    const cachedData = await this.cacheService.get(redisKey);
    if (cachedData) {
      return cachedData;
    }
    let facets: any = {};
    try {
      facets["genres"] = await this.getGenreFacets(selectedSources);
      facets["statusTypes"] = await this.getStatusTypeFacets(selectedSources);
      facets["mediaTypes"] =
        await this.getSupportedMediaTypesFacet(selectedSources);
      facets["sources"] = Object.keys(this.sourceClientMap);
    } catch (error) {}

    if (Boolean(facets)) {
      await this.cacheService.set(redisKey, facets, "14D");
    }
    return facets;
  }

  private mergeSourceResults = (
    resultsMap: Record<string, MangaResponse[]>,
  ): MangaResponse[] => {
    if (!resultsMap) return [];
    const map = new Map<string, MangaResponse>();

    for (const [key, results] of Object.entries(resultsMap)) {
      for (const manga of results) {
        const mapKey = slugifyTitle(manga.title);
        const oldManga = map.get(mapKey);
        if (!oldManga) {
          map.set(mapKey, manga);
          continue;
        }
        const mangaKeySource = key as MangaSourceType;
        const otherImages = oldManga.otherImages || [];

        const mergedManga = {
          ...oldManga,
          otherImages: [
            ...otherImages,
            { sourceId: mangaKeySource, url: manga.coverImage },
          ],
          otherIds: {
            [key]: manga.id.toString(),
          },
        };
        map.set(mapKey, mergedManga);
      }
    }
    return Array.from(map.values());
  };

  private async getSupportedMediaTypesFacet(
    sources: MangaSourceType[],
  ): Promise<string[]> {
    const resultsMap: Record<string, string[]> = {};

    for (const source of sources) {
      try {
        const client = iocContainer.resolve<MangaSourceClient>(
          this.sourceClientMap[source],
        );
        const response = await client.getSupportedMediaTypes();
        const isClientHealthy = await client.isHealthy();
        if (isClientHealthy) {
          if (response && hasItems(response) && Array.isArray(response)) {
            resultsMap[source] = response;
          }
        }
      } catch (error) {
        console.log("could not load for source", source);
        console.log(error);
      }
    }
    return pipe(
      (results: Record<string, string[]>) => Object.values(results),
      flatten,
      normalizeWordsForSources,
      uniqBy((mediaType: string) => slugifyTitle(mediaType)),
      (types) => sortArrayBySortOrder(types, "media"),
    )(resultsMap);
  }

  private async getStatusTypeFacets(sources: MangaSourceType[]) {
    const resultsMap: Record<string, string[]> = {};

    for (const source of sources) {
      try {
        const client = iocContainer.resolve<MangaSourceClient>(
          this.sourceClientMap[source],
        );
        const response = await client.getMediaStatusTypes();
        const isClientHealthy = await client.isHealthy();
        if (isClientHealthy) {
          if (response && hasItems(response) && Array.isArray(response)) {
            resultsMap[source] = response;
          }
        }
      } catch (error) {
        console.log("could not load for source", source);
        console.log(error);
      }
    }
    return pipe(
      (results: Record<string, string[]>) => Object.values(results),
      flatten,
      normalizeWordsForSources,
      uniqBy((statusType: string) => slugifyTitle(statusType)),
      (statuses) => sortArrayBySortOrder(statuses, "status"),
    )(resultsMap);
  }

  private async getGenreFacets(sources: MangaSourceType[]) {
    const resultsMap: Record<string, string[]> = {};

    for (const source of sources) {
      try {
        const client = iocContainer.resolve<MangaSourceClient>(
          this.sourceClientMap[source],
        );
        const response = await client.getGenres();
        const isClientHealthy = await client.isHealthy();
        if (isClientHealthy) {
          if (response && hasItems(response) && Array.isArray(response)) {
            resultsMap[source] = response.map((genre) => genre.name);
          }
        }
      } catch (error) {
        console.log("could not load for source", source);
      }
    }
    return this.mergeGenresResults(resultsMap);
  }

  private mergeGenresResults(resultsMap: Record<string, string[]>): string[] {
    if (!resultsMap) return [];

    return pipe(
      (results: Record<string, string[]>) => Object.values(results),
      flatten,
      uniqBy((genre: string) => slugifyTitle(genre)),
      (genres) => sortArrayBySortOrder(genres, "genre"),
    )(resultsMap);
  }
}
