import { RedisClientType } from "redis";
import { imageCache, redisClient } from "@api/database";
import Injectable from "@decorators/injectable";
import { LRUCache } from "lru-cache";

const DEFAULT_TTL = parseInt(process.env.REDIS_CAHE_EXPIRATION || "60");
const disableRedis = process.env.DISABLE_REDIS === "true";

type TTLString = `${number}${"m" | "h" | "d" | "M" | "H" | "D"}`;
const TTLMultipliers: Record<string, number> = {
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
};

export function parseTTL(input: number | TTLString): number {
  if (!input) return DEFAULT_TTL;
  if (typeof input === "number") return input;

  const match = input.trim().match(/^(\d+)\s*([mhdMHD])$/) as RegExpMatchArray;
  if (!match) {
    throw new Error(`Invalid TTL format: ${input}`);
  }
  const [_, value, unit] = match;
  return Math.abs(parseInt(value, 10)) * TTLMultipliers[unit.toLowerCase()];
}

@Injectable()
export default class CacheService {
  private get redisClient(): RedisClientType {
    return redisClient;
  }

  private get imageCache(): LRUCache<string, Buffer> {
    return imageCache;
  }

  set = async (
    redisKey: string,
    data: Record<string, any>,
    TTL: number | TTLString = DEFAULT_TTL,
  ) => {
    if (this.skipCache) return;
    const expiration = parseTTL(TTL);
    const result = await this.redisClient.set(redisKey, JSON.stringify(data), {
      EX: expiration,
    });
    return result === "OK";
  };

  get = async (redisKey: string) => {
    if (this.skipCache) return null;
    const cachedData = await this.redisClient.get(redisKey);
    if (!cachedData) return null;
    return JSON.parse(cachedData!);
  };

  del = async (key: string) => {
    if (!key) return;
    return await this.redisClient.del(key);
  };

  getCachedImage = (key: string) => {
    if (!key || !this.imageCache) return;
    try {
      return this.imageCache.get(key);
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  cacheImage = async (key: string, image: Buffer) => {
    if (!key || !Boolean(image)) return;
    try {
      return Boolean(this.imageCache.set(key, image));
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  private get skipCache(): boolean {
    return disableRedis || !this.redisClient?.isReady;
  }
}
