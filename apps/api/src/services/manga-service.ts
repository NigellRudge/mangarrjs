import Injectable from "@decorators/injectable";
import CacheService from "@services/cache-service";
import { MangaSourceType } from "@mangaClients/shared/types";
import MangaSourceClient from "@mangaClients/shared/base-client";
import { iocContainer } from "@iocContainer/ioc-container";
import MangaDexClient from "@mangaClients/manga-dex";
import MangaPillClient from "@mangaClients/manga-pill";

@Injectable()
export default class MangaService {
  constructor(private readonly cacheService: CacheService) {}

  public async getInfo(sourceId: MangaSourceType, mangaId: string) {
    const cacheKey = `getInfo-${sourceId}-${mangaId}`;
    console.log({ mangaId });
    const cachedResponse = await this.cacheService.get(cacheKey);
    if (Boolean(cachedResponse)) {
      return cachedResponse;
    }
    const mangaSourceClient = this.getMangaSourceClient(sourceId);
    const response = await mangaSourceClient.getInfo(mangaId);

    if (response) {
      await this.cacheService.set(cacheKey, response, "5d");
    }
    return response;
  }

  public async getNewChapters(sourceId: MangaSourceType) {
    const cacheKey = `new-chapters-${sourceId}`;
    const cachedResponse = await this.cacheService.get(cacheKey);
    if (Boolean(cachedResponse)) {
      return cachedResponse;
    }
    const mangaSourceClient = this.getMangaSourceClient(sourceId);
    const newChapters = await mangaSourceClient.getNewChapters();

    if (newChapters) {
      await this.cacheService.set(cacheKey, newChapters, "1d");
    }
    return newChapters;
  }

  private getMangaSourceClient(
    mangaSourceId: MangaSourceType,
  ): MangaSourceClient {
    switch (mangaSourceId) {
      case "manga-dex":
        return iocContainer.resolve(MangaDexClient);
      case "manga-pill":
        return iocContainer.resolve(MangaPillClient);
      default:
        return iocContainer.resolve(MangaDexClient);
    }
  }
}
