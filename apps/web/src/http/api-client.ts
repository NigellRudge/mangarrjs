import axios, { AxiosInstance } from "axios";
import * as querystring from "node:querystring";
import "dotenv/config";
import { jwtDecode } from "jwt-decode";
import { getFromLocalStorage, setInLocalStorage } from "@/utils/local-storage";
import {
  DiscoverFilters,
  MangaResponse,
  MangaSourceType,
} from "@mangarr/shared";

export const isTokenValid = (token?: string) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000; // seconds
    return decoded.exp > now;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getAuthToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;
  return `Bearer ${accessToken}`;
};

class ApiClient {
  private readonly client: AxiosInstance;
  constructor(baseURL: string, headers: Record<string, string | number>) {
    this.client = axios.create({ baseURL, headers, withCredentials: true });
  }

  search = async (
    query: string,
    page: number = 1,
    source: "manga-pill" | "manga-dex" = "manga-dex",
  ) => {
    try {
      const response = await this.client.get(
        `search?${querystring.stringify({ query, page, source })}`,
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

  quickSearch = async (
    query: string,
    source: "manga-pill" | "manga-dex" = "manga-dex",
  ) => {
    try {
      const response = await this.client.get(
        `search?${querystring.stringify({ query, source })}`,
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

  getTrendingManga = async () => {
    const storageKey = "trending-mangas";
    try {
      const storedData = getFromLocalStorage<MangaResponse[]>(storageKey);
      if (storedData) {
        return storedData;
      }
      const response = await this.client.get(`/trending/`, {});
      if (response.status === 200) {
        setInLocalStorage(storageKey, response.data, 5);
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

  login = async (data: { email: string; password: string }) => {
    const response = await this.client.post(`auth/login`, {
      email: data.email,
      password: data.password,
    });
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return response.data;
  };

  logout = async () => {
    try {
      const response = await this.client.get(`auth/logout`, {});
      return response.status === 200;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  refresh = async () => {
    try {
      const response = await this.client.post(
        `auth/refresh`,
        {},
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getInfo = async ({ id, source }: { id: string; source: MangaSourceType }) => {
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
      sources: "all",
    },
  ) => {
    try {
      const response = await this.client.get(
        `discover/search?${querystring.stringify(filters)}`,
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
      const response = await this.client.get(`discover/facets`, {
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

export const backendClient = new ApiClient(
  process.env.NEXT_PUBLIC_BACKEND_URL || "",
  {},
);
