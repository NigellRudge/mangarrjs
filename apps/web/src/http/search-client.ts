import querystring from "node:querystring";
import {
  DiscoverFilters,
  MangaInfoResponse,
  MangaResponse,
  MangaSourceType,
} from "@mangarr/shared";
import { BackendClient } from "@/http/backend-client";
import { getAuthToken } from "@/http/auth-client";
import LocalStorageClient from "@/http/local-storage";

class SearchClient extends BackendClient {
  private localStorageClient: LocalStorageClient;
  constructor(headers: Record<string, string | number>) {
    super(headers);
    this.localStorageClient = new LocalStorageClient();
  }

  search = async (
    query: string,
    page: number = 1,
    source: "manga-pill" | "manga-dex" = "manga-dex",
  ) => {
    try {
      const storageKey = JSON.stringify({ query, page });
      const storedData =
        this.localStorageClient.get<MangaResponse[]>(storageKey);
      if (storedData) {
        return storedData;
      }
      const response = await this.client.get(
        `search?${querystring.stringify({ query, page, source })}`,
        {
          withCredentials: true,
          headers: {
            authorization: getAuthToken(),
          },
        },
      );
      if (response.status === 200) {
        this.localStorageClient.set<MangaResponse[]>(
          storageKey,
          response.data,
          "1m",
        );
        return response.data;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getTrendingManga = async () => {
    const storageKey = "trending-mangas";
    try {
      const storedData =
        this.localStorageClient.get<MangaResponse[]>(storageKey);
      if (storedData) {
        return storedData;
      }
      const response = await this.client.get(`/trending/`, {});
      if (response.status === 200) {
        this.localStorageClient.set<MangaResponse[]>(
          storageKey,
          response.data,
          "2D",
        );
        return response.data;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getNewChapters = async () => {
    try {
      const response = await this.client.get(`/manga/new`, {
        withCredentials: true,
        headers: {
          authorization: getAuthToken(),
        },
        params: {
          source: "manga-pill",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getInfo = async ({
    id,
    source,
  }: {
    id: string;
    source: MangaSourceType;
  }): Promise<MangaInfoResponse | null> => {
    try {
      const response = await this.client.get(`manga/${id}`, {
        withCredentials: true,
        params: {
          source,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
      console.log({ response });
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  discover = async (
    filters: DiscoverFilters = {
      page: 1,
      pageSize: 20,
      genres: [],
      sources: [],
    },
  ) => {
    try {
      const response = await this.client.get(
        `search/discover?${querystring.stringify(filters)}`,
        {
          withCredentials: true,
          headers: {
            authorization: getAuthToken(),
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  discoverFacets = async () => {
    try {
      const response = await this.client.get(`search/facets`, {
        withCredentials: true,
        headers: {
          authorization: getAuthToken(),
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export const searchClient = new SearchClient({});
