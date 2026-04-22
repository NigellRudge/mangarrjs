import {
  MangaDexChapter,
  MangaDexListResponse,
  MangaDexManga,
  MangaDexResponse,
  MangaDexTag,
} from "@mangaClients/manga-dex/types";
import GeneralError from "@errors/general-error";
import {
  convertMangaDexChapterToStandardChapter,
  convertMangaDexToStandardManga,
  getCoverFileName,
  getRelatedManga,
  mapCoverResponseToObject,
  normalizeMangaDexMangaInfo,
} from "@mangaClients/manga-dex/utils";
import MangaDexConfig from "@mangaClients/manga-dex/config";
import {
  ChapterListItem,
  MangaInfoResponse,
  MangaListItem,
  MangaSourceGenre,
} from "@mangaClients/shared/types";
import MangaSourceClient from "@mangaClients/shared/base-client";
import Injectable from "@decorators/injectable";
import NotFoundError from "@errors/not-found-error";
import { hasItems, joinSafe } from "@utils/list";
import CacheService from "@services/cache-service";
import { SearchFilters } from "@utils/request-utils";
import { keys, uniq } from "ramda";

const { MANGA_DEX_BASE_URL } = MangaDexConfig;

@Injectable()
export default class MangaDexClient extends MangaSourceClient {
  constructor(private readonly cacheService: CacheService) {
    super(MANGA_DEX_BASE_URL, {
      "Content-Type": "application/json",
      Accept: "application/json",
    });
  }

  public async quickSearch(query: string): Promise<MangaListItem[]> {
    const res = await this.client.get<MangaDexListResponse<MangaDexManga>>(
      `/manga`,
      {
        params: {
          title: query,
          limit: 10,
          includes: ["cover_art"],
          availableTranslatedLanguage: ["en"],
        },
      },
    );
    if (res.status !== 200) {
      throw new GeneralError("something went wrong!");
    }
    return res.data.data.map(convertMangaDexToStandardManga).slice(0, 5);
  }

  public async search(
    query: string,
    searchFilters: SearchFilters = {
      page: 1,
      pageSize: 10,
    },
  ): Promise<MangaListItem[]> {
    const { page = 1, pageSize: limit = 20, genres = [] } = searchFilters;
    const offset = (page - 1) * limit;
    const params: Record<string, any> = {
      title: query,
      limit,
      offset,
      includes: ["cover_art", "genres"],
      availableTranslatedLanguage: ["en"],
    };
    if (hasItems(genres)) {
      const includedTags = await this.getGenreIds(genres);
      if (hasItems(includedTags)) {
        params.includedTags = includedTags;
      }
    }
    const res = await this.client.get<MangaDexListResponse<MangaDexManga>>(
      `/manga`,
      {
        params,
      },
    );
    if (res.status !== 200) {
      throw new GeneralError("something went wrong!");
    }
    return res.data.data.map(convertMangaDexToStandardManga);
  }

  public async getGenres(): Promise<MangaSourceGenre[]> {
    const redisKey = "manga-dex-genres";
    const cachedData = await this.cacheService.get(redisKey);
    if (cachedData) {
      return cachedData;
    }
    const response =
      await this.client.get<MangaDexListResponse<MangaDexTag>>("/manga/tag");
    if (response.status !== 200) {
      throw new GeneralError("something went wrong!");
    }
    const genres = response.data.data
      .filter((tag) => tag.attributes.group === "genre")
      .map((tag) => {
        return {
          id: tag.id,
          name: tag.attributes.name["en"],
          sourceId: "manga-dex",
        };
      });

    if (hasItems(genres)) {
      await this.cacheService.set(redisKey, genres);
    }
    return genres;
  }

  public async getInfo(mangaId: string): Promise<MangaInfoResponse> {
    const response = await this.client.get<MangaDexResponse<MangaDexManga>>(
      `/manga/${mangaId}`,
      {
        params: {
          includes: ["cover_art", "author", "genres", "tags"],
          translatedLanguage: ["en"],
        },
      },
    );
    if (response.status !== 200) {
      throw new NotFoundError(`manga with ID not found: ${mangaId}`);
    }
    return normalizeMangaDexMangaInfo(response.data.data);
  }

  public async getNewChapters(): Promise<ChapterListItem[]> {
    const res = await this.makeRequest("get", "/chapter", {
      limit: 30,
      "order[publishAt]": "desc",
      "includes[]": ["manga", "cover_art"],
      "translatedLanguage[]": ["en"],
    });
    const mappedChapters = await this.getChaptersCoverImages(res.data);
    return mappedChapters.map(convertMangaDexChapterToStandardChapter);
  }

  private makeRequest = async (
    method: "post" | "get" = "get",
    url: string,
    params: Record<string, any>,
  ) => {
    const response = await this.client[method]<MangaDexListResponse<any>>(url, {
      params,
    });
    if (response.status !== 200) {
      throw new GeneralError("something went wrong!");
    }
    return response.data;
  };

  private async getChaptersCoverImages(
    chapters: MangaDexChapter[],
  ): Promise<MangaDexChapter[]> {
    const mangaIds: string[] = Array.from(
      new Set(
        chapters
          .map((chapter) => getRelatedManga(chapter)!?.id)
          .filter(Boolean),
      ),
    );
    const mangaCoverMap = await this.getCoverImages(mangaIds);

    const notFoundCovers = mangaIds.filter(
      (id) => !Object.keys(mangaCoverMap).includes(id),
    );

    const otherCoverMap =
      (await this.getMangaCoverIdsById(notFoundCovers)) || {};

    const allCovers = { ...mangaCoverMap, ...otherCoverMap };
    return chapters.map((chapter) => {
      const relatedManga = getRelatedManga(chapter)!;
      return {
        ...chapter,
        attributes: {
          ...chapter.attributes,
          coverImage: relatedManga ? allCovers[relatedManga.id] : undefined,
        },
      };
    });
  }

  private async getCoverImages(mangaIds: string[]) {
    if (!hasItems(mangaIds)) return {};
    const cacheKey = joinSafe(mangaIds, "-");
    const cachedResponse = await this.cacheService.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
    const res = await this.makeRequest("get", "/cover", {
      "manga[]": mangaIds,
    });

    const coverMap = mapCoverResponseToObject(res.data) || {};

    if (Object.keys(coverMap).length > 0) {
      await this.cacheService.set(cacheKey, coverMap, "10D");
    }
    return coverMap;
  }

  private async getGenreIds(genresToSearch: string[]) {
    if (!hasItems(genresToSearch)) return [];
    const availableGenres = await this.getGenres();
    genresToSearch = uniq(genresToSearch.map((genre) => genre.toLowerCase()));
    return availableGenres
      .filter((genre) => genresToSearch.includes(genre.name.toLowerCase()))
      .map((genre) => genre.id);
  }

  private async getMangaCoverIdsById(mangaIds: string[]) {
    if (!hasItems(mangaIds)) return null;
    const cacheKey = joinSafe([...mangaIds, "other-covers"], "-");
    const cachedResponse = await this.cacheService.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
    const response = await this.client.get<MangaDexListResponse<MangaDexManga>>(
      "/manga",
      {
        params: {
          "ids[]": mangaIds,
          "includes[]": ["cover_art"],
        },
      },
    );
    if (response.status !== 200) return null;
    const { data } = response.data;

    const coverMap = data.reduce((acc, curr) => {
      const filename = getCoverFileName(curr);
      if (!filename) return acc;
      return {
        ...acc,
        [curr.id]: filename,
      };
    }, {});

    if (Object.keys(coverMap).length > 0) {
      await this.cacheService.set(cacheKey, coverMap, "10D");
    }
    return coverMap;
  }
}
