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

export class BackendClient {
  protected readonly client: AxiosInstance;
  constructor(
    headers: Record<string, string | number>,
    withCredentials?: boolean,
  ) {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
      headers,
      withCredentials,
    });
  }
}
