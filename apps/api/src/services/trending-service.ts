import Injectable from "@decorators/injectable";
import CacheService from "@services/cache-service";
import AnilistApiClient from "@mangaClients/ani-list";
import MangaSourceClient from "@mangarr/shared/http";
import MangaDexClient from "@mangaClients/manga-dex";
import MangaPillClient from "@mangaClients/manga-pill";
import { iocContainer } from "@iocContainer/ioc-container";
import { hasItems, MangaResponse, MangaSourceType } from "@mangarr/shared";
import { mergeSourceResults } from "@mangarr/shared/types/dtos/shared";

@Injectable()
export default class TrendingService {
  private readonly sourceClientMap: Record<
    string,
    new (...args: any[]) => MangaSourceClient
  > = {
    "manga-dex": MangaDexClient,
    "manga-pill": MangaPillClient,
    "ani-list": AnilistApiClient,
  };

  constructor(private readonly cacheService: CacheService) {}

  public async getTrendingMangas(): Promise<MangaResponse[]> {
    const today = new Date().toDateString().replace(" ", "-").toLowerCase();
    const keys = Object.keys(this.sourceClientMap).join("-");
    const redisKey = `trending-${today}${keys}`;
    const cachedData = await this.cacheService.get(redisKey);
    if (cachedData) {
      return cachedData;
    }

    const resultsMap: Record<string, MangaResponse[]> = {};
    const selectedSources = Object.keys(
      this.sourceClientMap,
    ) as MangaSourceType[];

    const clientRequestPromises = selectedSources.map(async (source) => {
      try {
        const client = iocContainer.resolve<MangaSourceClient>(
          this.sourceClientMap[source],
        );
        const isClientHealthy = await client.isHealthy();
        if (isClientHealthy) {
          const response = await client.getTrendingMangas();
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
    const mergedResults = mergeSourceResults(resultsMap);

    if (hasItems(mergedResults)) {
      await this.cacheService.set(redisKey, mergedResults, "1D");
    }
    return mergedResults;
  }
}
