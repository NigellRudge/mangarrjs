import Injectable from "@decorators/injectable";
import CacheService from "@services/cache-service";
import AnilistApiClient from "@mangaClients/ani-list";

@Injectable()
export default class TrendingService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly anilistClient: AnilistApiClient,
  ) {}

  getTrendingMangas = async () => {
    const cacheKey = `trending-mangas`;
    const cachedResponse = await this.cacheService.get(cacheKey);
    if (Boolean(cachedResponse)) {
      return cachedResponse;
    }
    const response = await this.anilistClient.getTrendingMangas();

    if (response) {
      await this.cacheService.set(cacheKey, response, "5d");
    }
    return response;
  };
}
