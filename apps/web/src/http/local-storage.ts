import { parseTTL, TTLString } from "@mangarr/shared/cache";
import { addSeconds, isAfter } from "date-fns";

const MINIMUM_TTL: TTLString = "5M";
const CACHE_KEY = "mangarr-cache-storage";

type CachedObject = Record<string, CachedEntry>;

type CachedEntry<T = any> = {
  created: Date;
  TTL: TTLString;
  data: T;
};

const isClient = typeof window !== "undefined";

export default class LocalStorageClient {
  constructor() {}

  private getCachedObject(): CachedObject {
    const cachedObject = localStorage.getItem(CACHE_KEY);
    if (!cachedObject) {
      return {};
    }
    return JSON.parse(cachedObject) as CachedObject;
  }

  private setCachedObject(cachedObject: CachedObject) {
    if (!cachedObject) return;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cachedObject));
  }

  set<T>(key: string, data: T, TTL: TTLString = MINIMUM_TTL) {
    if (!isClient) return;
    this.validateData();
    const cachedObject = this.getCachedObject();
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        ...cachedObject,
        [key]: {
          TTL,
          created: Date.now(),
          data,
        },
      }),
    );
  }

  get<T>(key: string): T | null {
    if (!isClient) return null;
    this.validateData();
    const cachedObject = this.getCachedObject();
    return cachedObject[key]?.data as T;
  }

  private validateData() {
    const cachedObject = this.getCachedObject();
    const validatedObject = Object.entries(cachedObject).reduce(
      (acc, [key, current]) => {
        const isValid = this.isValid(current);
        if (!isValid) {
          return acc;
        }
        return {
          ...acc,
          [key]: current,
        };
      },
      {},
    );
    this.setCachedObject(validatedObject);
  }

  private isValid(entry: CachedEntry): boolean {
    if (!entry) return false;
    const { TTL, created } = entry;
    const now = Date.now();
    const endDate = addSeconds(new Date(created), parseTTL(TTL));
    return isAfter(endDate, now);
  }
}
